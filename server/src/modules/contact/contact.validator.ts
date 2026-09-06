import joi from "joi";

export class ContactValidator {
  static sendMessageValidator = {
    body: joi.object({
      name: joi.string().trim().min(1).required(),
      email: joi.string().email().required(),
      message: joi.string().trim().min(1).max(2000).required(),
    }),
  };
}
