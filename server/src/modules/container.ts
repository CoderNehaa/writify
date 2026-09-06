// Middlewares import
import { AuthMiddleware } from "../middlewares/auth.middleware";

// Services import
import { EmailService } from "../clients/email.service";
import { OTPService } from "./otp/otp.service";
import { UserService } from "./user/user.service";
import { TokenService } from "../clients/token.service";
import { S3Service } from "../clients/s3.service";
import { CategoryService } from "./category/category.service";
import { ArticleService } from "./article/article.service";
import { BookmarkService } from "./bookmark/bookmark.service";
import { AuthController } from "./auth/auth.controller";
import { UserController } from "./user/user.controller";

// Controllers import
import { CategoryController } from "./category/category.controller";
import { ArticleController } from "./article/article.controller";
import { BookmarkController } from "./bookmark/bookmark.controller";
import { ContactController } from "./contact/contact.controller";

// Services
const userService = new UserService();
const otpService = new OTPService();
const tokenService = new TokenService();
const categoryService = new CategoryService();
const articleService = new ArticleService();
const bookmarkService = new BookmarkService();
const s3Service = new S3Service();
export const emailService = new EmailService();

// Middlewares
export const authMiddleware = new AuthMiddleware(userService, tokenService);

// Controllers
export const userController = new UserController(
  userService,
  s3Service,
  tokenService,
  articleService
);
export const authController = new AuthController(
  userService,
  otpService,
  emailService,
  tokenService,
  s3Service
);
export const categoryController = new CategoryController(categoryService);
export const articleController = new ArticleController(
  articleService,
  s3Service
);
export const bookmarkController = new BookmarkController(bookmarkService);
export const contactController = new ContactController(emailService);
