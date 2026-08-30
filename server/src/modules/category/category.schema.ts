// category.schema.ts for category module
import { Schema, model } from "mongoose";
import { COLLECTION_NAMES } from "../../constants/collections";
import { ICategory } from "./category.type";

const CategorySchema = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<ICategory>(
  COLLECTION_NAMES.CATEGORY,
  CategorySchema
);
