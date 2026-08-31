interface IArticle {
  _id: string;
  title: string;
  content: string;
  author: IAuthor;
  category: ICategory;
  tags: string[];
  isDraft?: boolean;
  isPaid?: boolean;
  coinPrice?: number;
  likes?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
  coverImage?: string;
  isBookmarked?: boolean;
}

interface IAuthor {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  articlesCount?: number;
  isFollowing?: boolean;
}

interface ICategory {
  _id: string;
  categoryName: string;
  articleCount?: number;
}

interface IComment {
  _id: string;
  content: string;
  author: IAuthor;
  createdAt: string;
  likes: number;
}

interface IArticleFilters {
  search?: string;
  category?: string;
  tags?: string[];
  isPaid?: boolean;
  author?: string;
}

interface ICreateArticlePayload {
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  isDraft?: boolean;
}

interface IBookmark {
  _id: string;
  articleId: IArticle | string;
  userId: string;
  createdAt?: string;
}
