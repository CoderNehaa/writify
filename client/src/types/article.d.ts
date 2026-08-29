interface IArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: Author;
  category: Category;
  tags: string[];
  isPaid: boolean;
  coinPrice?: number;
  likes: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  readTime: number;
  isBookmarked?: boolean;
}

interface IAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  articlesCount: number;
  isFollowing?: boolean;
}

interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

interface IComment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
}

interface IArticleFilters {
  search?: string;
  category?: string;
  tags?: string[];
  isPaid?: boolean;
}
