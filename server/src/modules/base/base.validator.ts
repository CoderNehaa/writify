import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { Types } from "mongoose";

type ValidatorSchema = {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
};

const validateSection = (
  data: any,
  res: Response,
  joiSchema?: Joi.ObjectSchema,
  sectionName?: string
) => {
  if (joiSchema) {
    const { error } = joiSchema.validate(data);
    if (error) {
      // TODO: format error message from error.details[0].message
      return res.status(400).json({
        success: false,
        message: error.details[0].message || `Invalid ${sectionName}`,
      });
    }
  } else {
    // If no schema is defined for this section, reject any data
    if (data && Object.keys(data).length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unexpected ${sectionName} data`,
      });
    }
  }
  return null;
};

export abstract class BaseValidator {
  static validateMongoObjectId = (value: string, helpers: any) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid MongoDB ObjectId format.");
    }
    return value;
  };
  
  static paramsIdValidator = {
    params: Joi.object({
      id: Joi.string()
        .custom(this.validateMongoObjectId, "ObjectId Validation")
        .required()
        .label("ID"),
    }),
  };

  static validateEndpoint(schema: ValidatorSchema = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
      // Validate each section
      let error =
        validateSection(req.body, res, schema.body, "body") ||
        validateSection(req.query, res, schema.query, "query") ||
        validateSection(req.params, res, schema.params, "params");

      if (error) return; // already sent response

      next();
    };
  }
}
