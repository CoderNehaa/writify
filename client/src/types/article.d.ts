type ArticleStatus = "draft" | "published";

interface IArticle {
  _id: string;
  title: string;
  content: string;
  author: IAuthor;
  category: ICategory;
  status: ArticleStatus;
  coverImage?: string;
  createdAt: string;
  updatedAt?: string;
}

interface IAuthor {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string;
  bio?: string;
}

interface ICategory {
  _id: string;
  categoryName: string;
}

interface IArticleFilters {
  category?: string;
  author?: string;
  search?: string;
}

interface ICreateArticlePayload {
  title: string;
  content: string;
  category: string;
  status?: ArticleStatus;
  coverImage?: File;
}
