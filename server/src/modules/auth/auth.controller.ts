import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

import { BaseController } from "../base/base.controller";
import { UserService } from "../user/user.service";
import { OTPService } from "../otp/otp.service";
import { IUser } from "../user/user.type";
import { TokenService } from "../../clients/token.service";
import { EmailService } from "../../clients/email.service";
import { S3Service } from "../../clients/s3.service";
import { toSafeUser } from "../../utils/user-serializer";
import { AUTH_RESPONSE_MESSAGES } from "../../constants/auth";
import { FORGOT_PASSWORD_EMAIL, SIGNUP_EMAIL } from "../../constants/email";
import { REFRESH_TOKEN_NAME, USERNAME_LENGTH } from "../../constants/auth";
import {
  GOOGLE_CLIENT_ID,
  REFRESH_TOKEN_SECRET_KEY,
} from "../../config/environment";

const { NEW_SIGNUP, EXISTING_SIGNUP } = AUTH_RESPONSE_MESSAGES;

export class AuthController extends BaseController {
  private userService: UserService;
  private otpService: OTPService;
  private emailService: EmailService;
  private tokenService: TokenService;
  private s3Service: S3Service;
  private googleClient: OAuth2Client;

  constructor(
    userService: UserService,
    otpService: OTPService,
    emailService: EmailService,
    tokenService: TokenService,
    s3Service: S3Service
  ) {
    super();
    this.userService = userService;
    this.otpService = otpService;
    this.emailService = emailService;
    this.tokenService = tokenService;
    this.s3Service = s3Service;
    this.googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    // bind all methods
    this.login = this.login.bind(this);
    this.checkUsername = this.checkUsername.bind(this);
    this.signup = this.signup.bind(this);
    this.verifyAccount = this.verifyAccount.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.logout = this.logout.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }

  // Single source of truth in utils/user-serializer — strips password/__v
  // (Google avatars are already full external URLs; resolveUrl passes
  // those through unchanged).
  private serializeUser = (user: any) => toSafeUser(user, this.s3Service);

  private async generateUniqueUsername(base: string): Promise<string> {
    const cleaned =
      base
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, USERNAME_LENGTH.MAX) || "user";

    let candidate = cleaned;
    let attempt = 0;
    while (await this.userService.getOne({ username: candidate })) {
      attempt++;
      const suffix = String(attempt);
      candidate = `${cleaned.slice(0, USERNAME_LENGTH.MAX - suffix.length)}${suffix}`;
    }
    return candidate;
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        return this.sendBadRequestResponse(res, "Invalid Google token");
      }

      let user = await this.userService.getOne({ email: payload.email });
      if (!user) {
        const username = await this.generateUniqueUsername(
          payload.email.split("@")[0]
        );
        user = await this.userService.create({
          email: payload.email,
          username,
          fullName: payload.name || username,
          avatar: payload.picture,
          password: this.userService.generateRandomPassword(),
          isVerified: true,
        });
      } else if (!user.isVerified) {
        user = await this.userService.updateById(String(user._id), {
          isVerified: true,
        });
      }

      // Sets the httpOnly access/refresh cookies and stores the refresh
      // token in Redis. The tokens are never returned in the body — the
      // browser only ever needs the cookies.
      await this.tokenService.generateAndSaveAuthTokens(res, String(user!._id));
      return this.sendSuccessResponse<{ user: IUser }>(
        res,
        { user: await this.serializeUser(user!) },
        "Logged in successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "googleLogin", "AuthController");
    }
  }

  async login(req: Request, res: Response) {
    try {
      let user = req.user;
      if (!user.isVerified) {
        const otp = await this.otpService.generateAndSaveOTP(user.email);

        this.emailService.sendMail(
          user.email,
          SIGNUP_EMAIL.SUBJECT,
          SIGNUP_EMAIL.BODY(otp, user.username)
        );
        return this.sendBadRequestResponse(
          res,
          "Account not verified! Account verification OTP sent on your email"
        );
      }

      let passwordMatches = await user.comparePassword(req.body.password);
      if (!passwordMatches) {
        return this.sendBadRequestResponse(res, "Invalid Credentials");
      }

      await this.tokenService.generateAndSaveAuthTokens(res, String(user._id));
      return this.sendSuccessResponse<{ user: IUser }>(
        res,
        { user: await this.serializeUser(user) },
        "Logged in successfully!"
      );
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

      let user = existingUser;
      if (!user) {
        // Only when creating a fresh account: make sure the username isn't
        // already held by someone else (returns 400, not a raw E11000 500).
        const usernameTaken = await this.userService.getOne({ username });
        if (usernameTaken) {
          return this.sendBadRequestResponse(res, "Username is already taken");
        }
        user = await this.userService.create({
          username,
          email,
          password,
          fullName,
        });
      }

      const otp = await this.otpService.generateAndSaveOTP(email);

      this.emailService.sendMail(
        user.email,
        SIGNUP_EMAIL.SUBJECT,
        SIGNUP_EMAIL.BODY(otp, user.username)
      );

      return this.sendSuccessResponse<IUser>(
        res,
        await this.serializeUser(user),
        existingUser ? EXISTING_SIGNUP(email) : NEW_SIGNUP(email)
      );
    } catch (e: any) {
      // Concurrent signups can still collide between the check and the
      // insert — surface that as a clean 400 rather than a 500.
      if (e?.code === 11000) {
        return this.sendBadRequestResponse(
          res,
          "An account with this email or username already exists"
        );
      }
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

      await session.commitTransaction();

      // Issue the session only after the verification is durably committed,
      // and await it so a Redis write failure surfaces as an error here
      // rather than an unhandled rejection.
      await this.tokenService.generateAndSaveAuthTokens(res, String(user._id));

      return this.sendSuccessResponse<IUser | null>(
        res,
        verifiedUser && (await this.serializeUser(verifiedUser)),
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
      await this.userService.updateById(String(user._id), {
        password: randomPassword,
      });

      this.emailService.sendMail(
        user.email,
        FORGOT_PASSWORD_EMAIL.SUBJECT,
        FORGOT_PASSWORD_EMAIL.BODY(randomPassword, user.username)
      );

      // Invalidate any existing session — the old password (and any
      // stolen refresh token) should stop working immediately.
      await this.tokenService.revokeRefreshToken(String(user._id));

      // This endpoint is unauthenticated — never return the user record.
      return this.sendSuccessResponse(
        res,
        null,
        "New password sent on email successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "forgotPassword", "AuthController");
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_NAME];
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY) as {
          id: string;
        };
        await this.tokenService.revokeRefreshToken(decoded.id);
      } catch {
        // Token already invalid/expired — nothing to revoke.
      }
    }
    this.tokenService.clearCookies(res);
    return this.sendSuccessResponse(res, null, "Logged out successfully!");
  }

  async checkUsername(req: Request, res: Response) {
    const { username } = req.body;
    // Any non-deleted account holds the username via the partial unique
    // index — verified or not — so don't filter by isVerified here or a
    // "taken" name reports as available and signup then 500s on E11000.
    let exists = await this.userService.getOne({ username });
    return this.sendSuccessResponse<{ usernameAvailable: boolean }>(res, {
      usernameAvailable: exists ? false : true,
    });
  }
}
