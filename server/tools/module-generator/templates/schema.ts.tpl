// {{module}}.schema.ts for {{module}} module
import { Schema, model } from "mongoose";
import { COLLECTION_NAMES } from "../../constants/collections";
import { I{{Module}} } from "./{{module}}.type";

const {{Module}}Schema = new Schema<I{{Module}}>(
  {},
  {
    timestamps: true,
  }
);

export const {{Module}}Model = model<I{{Module}}>(COLLECTION_NAMES.{{ModuleUpper}} ?? "{{module}}s", {{Module}}Schema);
