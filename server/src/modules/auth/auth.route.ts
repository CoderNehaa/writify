// auth.route.ts for auth module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { AuthValidator } from "./auth.validator";
import { authController, authMiddleware } from "../container";
import { authRateLimiter } from "../../middlewares/rateLimiter.middleware";

const authRouter = Router();
const { validateEndpoint } = BaseValidator;
const {
  signupValidator,
  loginValidator,
  verifyAccountValidator,
  emailValidator,
  checkUsernameValidator,
  googleLoginValidator,
} = AuthValidator;

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create a new account (or resend OTP for an unverified one)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, fullName]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               fullName: { type: string }
 *     responses:
 *       200: { description: Signup successful, OTP emailed }
 *       400: { description: Email already exists (and verified) }
 */
authRouter.post(
  "/signup",
  authRateLimiter,
  validateEndpoint(signupValidator),
  authController.signup
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in, sets access/refresh cookies }
 *       400: { description: Invalid credentials or account not verified }
 *       404: { description: No account with this email }
 */
authRouter.post(
  "/login",
  authRateLimiter,
  validateEndpoint(loginValidator),
  authMiddleware.userExistWithEmail,
  authController.login
);

/**
 * @openapi
 * /auth/google:
 *   post:
 *     summary: Log in or sign up using a Google ID token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: The Google ID token credential from Google Identity Services
 *     responses:
 *       200: { description: Logged in, sets access/refresh cookies }
 *       400: { description: Invalid Google token }
 */
authRouter.post(
  "/google",
  authRateLimiter,
  validateEndpoint(googleLoginValidator),
  authController.googleLogin
);

/**
 * @openapi
 * /auth/verify-account:
 *   post:
 *     summary: Verify an account with the OTP sent by email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200: { description: Account verified, sets access/refresh cookies }
 *       400: { description: Invalid OTP or already verified }
 */
authRouter.post(
  "/verify-account",
  authRateLimiter,
  validateEndpoint(verifyAccountValidator),
  authMiddleware.userExistWithEmail,
  authController.verifyAccount
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Reset a forgotten password and email the new one
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: New password generated and emailed }
 *       404: { description: No account with this email }
 */
authRouter.post(
  "/forgot-password",
  authRateLimiter,
  validateEndpoint(emailValidator),
  authMiddleware.userExistWithEmail,
  authController.forgotPassword
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out the current session
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out, clears cookies and revokes the refresh token }
 */
authRouter.post("/logout", validateEndpoint(), authController.logout);

/**
 * @openapi
 * /auth/check-username:
 *   post:
 *     summary: Check whether a username is available
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username: { type: string }
 *     responses:
 *       200: { description: "{ usernameAvailable: boolean }" }
 */
authRouter.post(
  "/check-username",
  validateEndpoint(checkUsernameValidator),
  authController.checkUsername
);

export default authRouter;
