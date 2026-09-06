import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import categoryRouter from "./modules/category/category.route";
import articleRouter from "./modules/article/article.route";
import bookmarkRouter from "./modules/bookmark/bookmark.route";
import contactRouter from "./modules/contact/contact.route";

export const routers = [
  { path: "auth", router: authRouter },
  { path: "user", router: userRouter },
  { path: "category", router: categoryRouter },
  { path: "article", router: articleRouter },
  { path: "bookmark", router: bookmarkRouter },
  { path: "contact", router: contactRouter },
];
