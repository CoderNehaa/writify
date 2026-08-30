// bookmark.route.ts for bookmark module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { bookmarkController, authMiddleware } from "../container";
import { BookmarkValidator } from "./bookmark.validator";

const bookmarkRouter = Router();
const { validateEndpoint, paramsIdValidator } = BaseValidator;

bookmarkRouter.use(authMiddleware.authentic);

bookmarkRouter.post(
  "/new",
  validateEndpoint(BookmarkValidator.createBookmark),
  bookmarkController.create
);

bookmarkRouter.get("/all", validateEndpoint(), bookmarkController.getAll);
bookmarkRouter.get(
  "/data/:id",
  validateEndpoint(paramsIdValidator),
  bookmarkController.getById
);
bookmarkRouter.put(
  "/:id",
  validateEndpoint(), //Implement validator with params and body
  bookmarkController.updateById
);
bookmarkRouter.delete(
  "/:id",
  validateEndpoint(paramsIdValidator),
  bookmarkController.deleteById
);

export default bookmarkRouter;
