import joi from "joi";
import {
  PASSWORD_LENGTH,
  passwordRegex,
  USERNAME_LENGTH,
} from "../../constants/auth";

export class AuthValidator {
  static signupValidator = {
    body: joi.object({
      username: joi
        .string()
        .min(USERNAME_LENGTH.MIN)
        .max(USERNAME_LENGTH.MAX)
        .required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .min(PASSWORD_LENGTH.MIN)
        .max(PASSWORD_LENGTH.MAX)
        .pattern(passwordRegex)
        .required(),
      fullName: joi.string().required(),
    }),
  };

  static loginValidator = {
    body: joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    }),
  };

  static verifyAccountValidator = {
    body: joi.object({
      email: joi.string().email().required(),
      otp: joi.string().min(6).max(6).required(),
    }),
  };

  static emailValidator = {
    body: joi.object({
      email: joi.string().email().required(),
    }),
  };

  static checkUsernameValidator = {
    body: joi.object({
      username: joi
        .string()
        .min(USERNAME_LENGTH.MIN)
        .max(USERNAME_LENGTH.MAX)
        .required(),
    }),
  };
}
