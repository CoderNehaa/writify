import { AuthMiddleware } from "../middlewares/auth.middleware";
import { EmailService } from "../clients/email.service";
import { AuthController } from "./auth/auth.controller";
import { OTPService } from "./otp/otp.service";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { TokenService } from "../clients/token.service";
import { S3Service } from "../clients/s3.service";

// Services
const userService = new UserService();
const otpService = new OTPService();
const emailService = new EmailService();
const tokenService = new TokenService();
const s3Service = new S3Service();

// Middlewares
export const authMiddleware = new AuthMiddleware(userService, tokenService);

// Controllers
export const userController = new UserController(userService, s3Service);
export const authController = new AuthController(
  userService,
  otpService,
  emailService,
  tokenService
);
