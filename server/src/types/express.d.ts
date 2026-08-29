import { IUser } from "../modules/user/user.type";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
