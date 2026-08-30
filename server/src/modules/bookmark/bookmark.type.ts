import { Document, Types } from "mongoose";

export interface IBookmark extends Document {
  articleId: Types.ObjectId;
  userId: Types.ObjectId;
}
