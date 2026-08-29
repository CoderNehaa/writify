// auth.route.ts for auth module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { AuthValidator } from "./auth.validator";
import { authController, authMiddleware } from "../container";

const authRouter = Router();
const { validateEndpoint } = BaseValidator;
const {
  signupValidator,
  loginValidator,
  verifyAccountValidator,
  emailValidator,
  checkUsernameValidator,
} = AuthValidator;

authRouter.post(
  "/signup",
  validateEndpoint(signupValidator),
  authController.signup
);

authRouter.post(
  "/login",
  validateEndpoint(loginValidator),
  authMiddleware.userExistWithEmail,
  authController.login
);

authRouter.post(
  "/verify-account",
  validateEndpoint(verifyAccountValidator),
  authMiddleware.userExistWithEmail,
  authController.verifyAccount
);

authRouter.post(
  "/forgot-password",
  validateEndpoint(emailValidator),
  authMiddleware.userExistWithEmail,
  authController.forgotPassword
);

authRouter.post("/logout", validateEndpoint(), authController.logout);
authRouter.post(
  "/check-username",
  validateEndpoint(checkUsernameValidator),
  authController.checkUsername
);

export default authRouter;
