// category.route.ts for category module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { categoryController, authMiddleware } from "../container";
import { CategoryValidator } from "./category.validator";

const categoryRouter = Router();
const { validateEndpoint, paramsIdValidator } = BaseValidator;
const { newCategoryValidator, updateCategoryValidator } = CategoryValidator;

categoryRouter.get("/all", validateEndpoint(), categoryController.getAll);

categoryRouter.use(authMiddleware.authentic);

categoryRouter.post(
  "/new",
  validateEndpoint(newCategoryValidator),
  categoryController.create
);

categoryRouter.get(
  "/data/:id",
  validateEndpoint(paramsIdValidator),
  categoryController.getById
);
categoryRouter.put(
  "/:id",
  validateEndpoint(updateCategoryValidator),
  categoryController.updateById
);
categoryRouter.delete(
  "/:id",
  validateEndpoint(paramsIdValidator),
  categoryController.deleteById
);

export default categoryRouter;
