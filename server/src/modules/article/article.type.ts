import { Document, Types } from "mongoose";

export enum EArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export interface IArticle extends Document {
  title: string;
  content: string;
  coverImage?: string;
  category: Types.ObjectId;
  author: Types.ObjectId;
  status: EArticleStatus;
}
