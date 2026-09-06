interface IUser {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  role?: "user" | "admin";
  createdAt?: string;
}

interface IUpdateForm {
  username: string;
  bio: string;
  fullName: string;
}
