import joi from "joi";
import { BaseValidator } from "../base/base.validator";
import {
  PASSWORD_LENGTH,
  passwordRegex,
  USERNAME_LENGTH,
} from "../../constants/auth";

export class UserValidator {
  // GET /user/data/:userId has no params schema by default, and the base
  // validator rejects any params with "Unexpected params data" when no
  // schema is registered for that section — so every request to view
  // another user's profile 400'd before reaching the controller.
  static getUserByIdValidator = {
    params: joi.object({
      userId: joi
        .string()
        .custom(BaseValidator.validateMongoObjectId, "ObjectId Validation")
        .required(),
    }),
  };
  static updateUserValidator = {
    body: joi
      .object({
        username: joi
          .string()
          .trim()
          .lowercase()
          .min(USERNAME_LENGTH.MIN)
          .max(USERNAME_LENGTH.MAX)
          .messages({
            "string.base": "Username must be a string",
            "string.min": `Username must be at least ${USERNAME_LENGTH.MAX} characters`,
            "string.max": `Username must be less than or equal to ${USERNAME_LENGTH.MAX} characters`,
          }),
        bio: joi.string().max(50).allow(""),
        fullName: joi.string().trim().min(1),
      })
      .min(1),
  };
  static deleteUserValidator = {
    body: joi.object({
      deleteArticles: joi.boolean().default(false),
    }),
  };
  static updatePasswordValidator = {
    body: joi.object({
      currentPassword: joi.string().required(),
      newPassword: joi
        .string()
        .min(PASSWORD_LENGTH.MIN)
        .max(PASSWORD_LENGTH.MAX)
        .pattern(passwordRegex)
        .required(),
    }),
  };
}
