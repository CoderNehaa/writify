import { Router } from "express";
import { authMiddleware, userController } from "../container";
import { BaseValidator } from "../base/base.validator";
import { UserValidator } from "./user.validator";
import { uploadImage } from "../../clients/multer.service";

const userRouter = Router();
const { validateEndpoint } = BaseValidator;
const {
  updateUserValidator,
  updatePasswordValidator,
  deleteUserValidator,
  getUserByIdValidator,
} = UserValidator;

userRouter.use(authMiddleware.authentic);

/**
 * @openapi
 * /user/me:
 *   get:
 *     summary: Get the logged-in user's own profile
 *     tags: [User]
 *     responses:
 *       200: { description: The current user }
 */
userRouter.get("/me", validateEndpoint(), userController.getLoggedInUser);

/**
 * @openapi
 * /user/data/{userId}:
 *   get:
 *     summary: Get a user's profile by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The requested user }
 */
userRouter.get(
  "/data/:userId",
  validateEndpoint(getUserByIdValidator),
  userController.getById
);

/**
 * @openapi
 * /user:
 *   put:
 *     summary: Update the logged-in user's profile (username, bio, fullName, avatar)
 *     tags: [User]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               bio: { type: string }
 *               fullName: { type: string }
 *               profile: { type: string, format: binary }
 *     responses:
 *       200: { description: Profile updated }
 *   delete:
 *     summary: Soft-delete the logged-in user's account
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deleteArticles:
 *                 type: boolean
 *                 description: Also permanently delete all of this user's articles
 *     responses:
 *       200: { description: Account deleted }
 */
userRouter.put(
  "/",
  uploadImage.any(),
  validateEndpoint(updateUserValidator),
  userController.updateUser
);
userRouter.delete(
  "/",
  validateEndpoint(deleteUserValidator),
  userController.deleteUser
);

/**
 * @openapi
 * /user/password:
 *   patch:
 *     summary: Change the logged-in user's password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Password updated, other sessions revoked }
 *       400: { description: Current password is incorrect }
 */
userRouter.patch(
  "/password",
  validateEndpoint(updatePasswordValidator),
  userController.resetPassword
);

export default userRouter;
