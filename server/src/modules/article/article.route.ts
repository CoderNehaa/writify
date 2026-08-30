// article.route.ts for article module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { articleController, authMiddleware } from "../container";

const articleRouter = Router();
const { validateEndpoint, paramsIdValidator } = BaseValidator;

articleRouter.use(authMiddleware.authentic);

articleRouter.get(
  "/all",
  validateEndpoint(),
  articleController.getAll
);
articleRouter.get(
  "/data/:id",
  validateEndpoint(paramsIdValidator),
  articleController.getById
);
articleRouter.put(
  "/:id",
  validateEndpoint(), //Implement validator with params and body
  articleController.updateById
);
articleRouter.delete(
  "/:id",
  validateEndpoint(paramsIdValidator),
  articleController.deleteById
);

export default articleRouter;
