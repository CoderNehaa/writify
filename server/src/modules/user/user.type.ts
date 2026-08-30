import { Document, ObjectId } from "mongoose";

export enum EUserRoles {
  USER = "user",
  admin = "admin", //incharge of library - only one who adds books
}

export interface IUser extends Document {
  email: string;
  avatar: string;
  username: string;
  fullName?: string;
  role: EUserRoles;
  isVerified: boolean;
  bio?: string;
  password?: string; //to prevent sending password in user object
  comparePassword(password: string): Promise<boolean>;
  isDeleted: boolean;
  profilePicture?: string;
}
