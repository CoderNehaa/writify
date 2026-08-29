interface IUser {
  _id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  isPremium?: boolean;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  articlesCount?: number;
  sharesRemaining?: number;
  articlesPosted?: number;
  isFollowing?: boolean;
}

interface IMembershipPlan {
  _id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
}

interface ITransaction {
  _id: string;
  type: "membership" | "article_purchase";
  amount: number;
  description: string;
  createdAt: string;
  status: "completed" | "pending" | "failed";
}

interface INotification {
  _id: string;
  type: "follow" | "article" | "hashtag";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
