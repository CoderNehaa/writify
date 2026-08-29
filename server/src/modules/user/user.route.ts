import { Router } from "express";
import { authMiddleware, userController } from "../container";
import { BaseValidator } from "../base/base.validator";
import { UserValidator } from "./user.validator";
import upload from "../../clients/multer.service";

const userRouter = Router();
const { validateEndpoint } = BaseValidator;
const { updateUserValidator } = UserValidator;

userRouter.use(authMiddleware.authentic);

userRouter.get("/me", validateEndpoint(), userController.getLoggedInUser);
userRouter.get("/data/:userId", validateEndpoint(), userController.getById);

userRouter.put(
  "/",
  validateEndpoint(updateUserValidator),
  userController.updateUser
);
userRouter.delete("/", validateEndpoint(), userController.deleteUser);

userRouter.patch("/password", validateEndpoint(), userController.resetPassword);

export default userRouter;
