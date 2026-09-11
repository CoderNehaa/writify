import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { UserService } from "./user.service";
import { S3Service } from "../../clients/s3.service";
import { TokenService } from "../../clients/token.service";
import { ArticleService } from "../article/article.service";
import { toSafeUser } from "../../utils/user-serializer";

export class UserController extends BaseController {
  private userService: UserService;
  public s3Service: S3Service;
  private tokenService: TokenService;
  private articleService: ArticleService;

  constructor(
    service: UserService,
    s3Service: S3Service,
    tokenService: TokenService,
    articleService: ArticleService
  ) {
    super();
    this.userService = service;
    this.s3Service = s3Service;
    this.tokenService = tokenService;
    this.articleService = articleService;
  }

  // Single source of truth in utils/user-serializer — strips password/__v
  // and resolves the private-bucket avatar key.
  private serializeUser = (user: any) => toSafeUser(user, this.s3Service);

  getLoggedInUser = async (req: Request, res: Response) => {
    return this.sendSuccessResponse(res, await this.serializeUser(req.user));
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (userId === String(req.user._id)) {
        return this.sendSuccessResponse(res, await this.serializeUser(req.user));
      }

      const user = await this.userService.getById(userId as string);
      return this.sendSuccessResponse(res, user && (await this.serializeUser(user)));
    } catch (e) {
      return this.handleError(res, e, "getById", "UserController");
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;
      // Only ever apply the fields a user is allowed to self-edit — never
      // spread the raw body (that's how `role` self-promotion happened before).
      const { username, bio, fullName } = req.body;
      let userData: Record<string, unknown> = {
        ...(username !== undefined ? { username } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(fullName !== undefined ? { fullName } : {}),
      };

      const newProfilePic =
        Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null;
      if (newProfilePic) {
        const ext = newProfilePic.originalname.split(".").pop();
        const key = `user/${userId}-${Date.now()}.${ext}`;
        const uploadResult = await this.s3Service.uploadFile(
          newProfilePic.buffer,
          key,
          newProfilePic.mimetype
        );
        if (uploadResult.success) {
          // Merge onto the already-filtered userData — never back onto the
          // raw req.body, which would reopen the role self-promotion hole.
          userData = { ...userData, avatar: key };
        }
      }

      const updatedUser = await this.userService.updateById(
        String(userId),
        userData
      );
      return this.sendSuccessResponse(
        res,
        updatedUser && (await this.serializeUser(updatedUser)),
        "Account updated successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "updateUser", "UserController");
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;
      const { deleteArticles } = req.body;

      if (deleteArticles) {
        await this.articleService.deleteAllByAuthor(String(userId));
      }

      const deletedUser = await this.userService.softDeleteById(String(userId));

      return this.sendSuccessResponse(
        res,
        deletedUser && (await this.serializeUser(deletedUser)),
        deleteArticles
          ? "Account and all articles deleted successfully!"
          : "Account deleted successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "deleteUser", "UserController");
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      const passwordMatches = await req.user.comparePassword(currentPassword);
      if (!passwordMatches) {
        return this.sendBadRequestResponse(res, "Current password is incorrect");
      }

      const updatedUser = await this.userService.updateById(String(userId), {
        password: newPassword,
      });

      // Force re-login everywhere else — the old session shouldn't survive
      // a password change.
      await this.tokenService.revokeRefreshToken(String(userId));

      return this.sendSuccessResponse(
        res,
        updatedUser && (await this.serializeUser(updatedUser)),
        "Password updated successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "resetPassword", "UserController");
    }
  };
}
