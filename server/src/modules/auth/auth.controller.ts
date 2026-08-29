import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { UserService } from "../user/user.service";
import { OTPService } from "../otp/otp.service";
import mongoose from "mongoose";
import { AUTH_RESPONSE_MESSAGES } from "../../constants/auth";
import { IUser } from "../user/user.type";
import { EmailService } from "../../clients/email.service";
import { SIGNUP_EMAIL } from "../../constants/email";
import { TokenService } from "../../clients/token.service";

const { NEW_SIGNUP, EXISTING_SIGNUP } = AUTH_RESPONSE_MESSAGES;

export class AuthController extends BaseController {
  private userService: UserService;
  private otpService: OTPService;
  private emailService: EmailService;
  private tokenService: TokenService;

  constructor(
    userService: UserService,
    otpService: OTPService,
    emailService: EmailService,
    tokenService: TokenService
  ) {
    super();
    this.userService = userService;
    this.otpService = otpService;
    this.emailService = emailService;
    this.tokenService = tokenService;

    // bind all methods
    this.login = this.login.bind(this);
    this.checkUsername = this.checkUsername.bind(this);
    this.signup = this.signup.bind(this);
    this.verifyAccount = this.verifyAccount.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(req: Request, res: Response) {
    try {
      let user = req.user;

      let passwordMatches = await user.comparePassword(req.body.password);
      if (!passwordMatches) {
        return this.sendBadRequestResponse(res, "Invalid Credentials");
      }

      const { accessToken, refreshToken } =
        await this.tokenService.generateAndSaveAuthTokens(
          res,
          String(user._id)
        );
      return this.sendSuccessResponse<{
        user: IUser;
        accessToken: string;
        refreshToken: string;
      }>(res, { user, accessToken, refreshToken }, "Logged in successfully!");
    } catch (e) {
      return this.handleError(res, e, "login", "AuthController");
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { username, email, password, fullName } = req.body;
      const existingUser = await this.userService.getOne({ email });
      if (existingUser && existingUser.isVerified) {
        return this.sendBadRequestResponse(res, "Email already exists");
      }

      const user =
        existingUser ||
        (await this.userService.create({ username, email, password, fullName }));
      const otp = await this.otpService.generateAndSaveOTP(email);

      this.emailService.sendMail(
        user.email,
        SIGNUP_EMAIL.SUBJECT,
        SIGNUP_EMAIL.BODY(otp, user.username)
      );

      return this.sendSuccessResponse<IUser>(
        res,
        user,
        existingUser ? EXISTING_SIGNUP(email) : NEW_SIGNUP(email)
      );
    } catch (e) {
      return this.handleError(res, e, "signup", "AuthController");
    }
  }

  async verifyAccount(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { email, otp } = req.body;
      let user = req.user;

      if (user.isVerified) {
        await session.abortTransaction();
        return this.sendBadRequestResponse(res, "Account already verified");
      }

      let otpDoc = await this.otpService.getOne(
        {
          email,
          otp,
        },
        session
      );
      if (!otpDoc) {
        await session.abortTransaction();
        return this.sendBadRequestResponse(res, "Invalid OTP!");
      }

      let verifiedUser = await this.userService.updateById(
        String(user._id),
        {
          isVerified: true,
        },
        session
      );
      this.tokenService.generateAndSaveAuthTokens(res, String(user._id));

      await session.commitTransaction();
      return this.sendSuccessResponse<IUser | null>(
        res,
        verifiedUser,
        "Account verified successfully!"
      );
    } catch (e) {
      await session.abortTransaction();
      return this.handleError(res, e, "verifyAccount", "AuthController");
    } finally {
      session.endSession();
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const user = req.user;
      let randomPassword = this.userService.generateRandomPassword();
      // TODO : send random password on email
      let updatedUser = await this.userService.updateById(String(user._id), {
        password: randomPassword,
      });

      return this.sendSuccessResponse<IUser | null>(
        res,
        updatedUser,
        "New password sent on email successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "forgotPassword", "AuthController");
    }
  }

  async logout(req: Request, res: Response) {
    this.tokenService.clearCookies(res);
    return this.sendSuccessResponse(res, null, "Logged out successfully!");
  }

  async checkUsername(req: Request, res: Response) {
    const { username } = req.body;
    let exists = await this.userService.getOne({ username });
    return this.sendSuccessResponse<{ usernameAvailable: boolean }>(res, {
      usernameAvailable: exists ? false : true,
    });
  }
}
