// article.schema.ts for article module
import { Schema, model } from "mongoose";
import { COLLECTION_NAMES } from "../../constants/collections";
import { EArticleStatus, IArticle } from "./article.type";

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.CATEGORY,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
    status: {
      type: String,
      enum: EArticleStatus,
      default: EArticleStatus.DRAFT,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ArticleModel = model<IArticle>(
  COLLECTION_NAMES.ARTICLE,
  ArticleSchema
);
