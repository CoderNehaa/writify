import { BaseService } from "../base/base.service";
import UserModel from "./user.schema";
import { IUser } from "./user.type";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }

  generateRandomPassword(): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*";
    const all = upper + lower + numbers + specials;

    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += specials[Math.floor(Math.random() * specials.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    while (password.length < 8) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle characters for randomness
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return password;
  }
}
