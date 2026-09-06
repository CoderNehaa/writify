import joi from "joi";
import { BaseValidator } from "../base/base.validator";
import { EArticleStatus } from "./article.type";

export class ArticleValidator extends BaseValidator {
  static newArticleValidator = {
    body: joi.object({
      title: joi.string().trim().min(1).required(),
      content: joi.string().min(1).required(),
      category: joi
        .string()
        .custom(this.validateMongoObjectId, "ObjectId Validation")
        .required()
        .label("Category"),
      status: joi
        .string()
        .valid(...Object.values(EArticleStatus))
        .default(EArticleStatus.DRAFT),
    }),
  };

  static updateArticleValidator = {
    body: joi
      .object({
        title: joi.string().trim().min(1),
        content: joi.string().min(1),
        category: joi
          .string()
          .custom(this.validateMongoObjectId, "ObjectId Validation")
          .label("Category"),
        status: joi.string().valid(...Object.values(EArticleStatus)),
      })
      .min(1),
    params: joi.object({
      id: joi
        .string()
        .custom(this.validateMongoObjectId, "ObjectId Validation")
        .required()
        .label("ID"),
    }),
  };

  static listArticlesValidator = {
    query: joi.object({
      category: joi
        .string()
        .custom(this.validateMongoObjectId, "ObjectId Validation")
        .label("Category"),
      author: joi
        .string()
        .custom(this.validateMongoObjectId, "ObjectId Validation")
        .label("Author"),
      status: joi.string().valid(...Object.values(EArticleStatus)),
      search: joi.string().trim().max(200),
    }),
  };
}
