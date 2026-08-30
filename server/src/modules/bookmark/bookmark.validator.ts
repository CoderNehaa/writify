import joi from "joi";
import { BaseValidator } from "../base/base.validator";

export class BookmarkValidator {
  static createBookmark = {
    body: joi.object({
      userId: joi.string().custom(BaseValidator.validateMongoObjectId).required,
      articleId: joi.string().custom(BaseValidator.validateMongoObjectId)
        .required,
    }),
  };
}
