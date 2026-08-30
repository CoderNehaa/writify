// article.schema.ts for article module
import { Schema, model } from "mongoose";
import { COLLECTION_NAMES } from "../../constants/collections";
import { IArticle } from "./article.type";

const ArticleSchema = new Schema<IArticle>(
  {},
  {
    timestamps: true,
  }
);

export const ArticleModel = model<IArticle>(
  COLLECTION_NAMES.ARTICLE,
  ArticleSchema
);
