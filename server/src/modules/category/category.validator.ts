import joi from "joi";
import { BaseValidator } from "../base/base.validator";

export class CategoryValidator extends BaseValidator {
  static newCategoryValidator = {
    body: joi.object({
      categoryName: joi.string().required(),
    }),
  };
  static updateCategoryValidator = {
    body: joi.object({
      categoryName: joi.string().required(),
    }),
    params: joi.object({
      id: joi
        .string()
        .custom(this.validateMongoObjectId, "ObjectId Validation")
        .required()
        .label("ID"),
    }),
  };
}
