export const ROUTES_PATH = {
  AUTH: {
    LOGIN: "/auth",
    SIGNP: "/auth?mode=signup",
    VERIFY: "/auth/verify",
    VERIFY_EMAIL: (email: string = "") => `/auth/verify?email=${email}`,
  },
  ARTICLE: {
    ROOT: "/articles",
    WRITE: "/write",
    ID: (articleId: string = "") => `/articles/${articleId}`,
  },
  CATEGORIES: "/categories",
  PROFILE: (userId: string = "") => `/profile/${userId}`,
  SETTINGS: "/settings",
  BOOKMARKS: "/bookmarks",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  MEMBERSHIP: "/membership",
};
