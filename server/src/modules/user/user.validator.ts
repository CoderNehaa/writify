import joi from "joi";
import {
  PASSWORD_LENGTH,
  passwordRegex,
  USERNAME_LENGTH,
} from "../../constants/auth";
import { EUserRoles } from "./user.type";

export class UserValidator {
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
        role: joi
          .string()
          .allow(...Object.values(EUserRoles))
          .default(EUserRoles.USER),
        bio: joi.string().max(50),
      })
      .min(1),
  };
  static updatePasswordValidator = {
    newPassword: joi
      .string()
      .min(PASSWORD_LENGTH.MIN)
      .max(PASSWORD_LENGTH.MAX)
      .pattern(passwordRegex)
      .required(),
  };
}
