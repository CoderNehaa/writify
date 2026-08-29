export const PLATFORM_FEATURES = [
  {
    title: "AI-Powered Writing",
    description: "Get intelligent title recommendations and writing suggestions to create engaging content",
    icon: "Sparkles",
  },
  {
    title: "Monetize Your Content",
    description: "Earn from your articles with our flexible monetization system and membership tiers",
    icon: "DollarSign",
  },
  {
    title: "Engage with Community",
    description: "Build your audience with social features, comments, and real-time interactions",
    icon: "Users",
  },
  {
    title: "Premium Membership",
    description: "Unlock unlimited features including bookmarks, unlimited sharing, and exclusive content",
    icon: "Crown",
  },
  {
    title: "Rich Text Editor",
    description: "Create beautiful articles with our advanced Tip-Tap editor and auto-save functionality",
    icon: "Edit",
  },
  {
    title: "Analytics & Insights",
    description: "Track your article performance, engagement metrics, and audience growth",
    icon: "TrendingUp",
  },
] as const;

export const MEMBERSHIP_BENEFITS = {
  free: [
    "Post up to 10 articles",
    "Share 5 articles per month",
    "Access to 3 daily title recommendations",
    "Basic engagement features",
    "Community access",
  ],
  premium: [
    "Unlimited articles",
    "Unlimited sharing",
    "Unlimited title recommendations",
    "Bookmark any article",
    "Download articles as PDF",
    "Priority support",
    "Advanced analytics",
    "Ad-free experience",
  ],
} as const;

export const SHARE_LIMIT_FREE = 5;
export const ARTICLE_LIMIT_FREE = 10;
export const TITLE_RECOMMENDATIONS_FREE = 3;
