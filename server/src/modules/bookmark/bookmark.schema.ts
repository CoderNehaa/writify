// bookmark.schema.ts for bookmark module
import { Schema, model } from "mongoose";
import { COLLECTION_NAMES } from "../../constants/collections";
import { IBookmark } from "./bookmark.type";

const BookmarkSchema = new Schema<IBookmark>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.ARTICLE,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BookmarkSchema.index({ articleId: 1, userId: 1 }, { unique: true });
export const BookmarkModel = model<IBookmark>(
  COLLECTION_NAMES.BOOKMARK,
  BookmarkSchema
);
