export const apiEndpoints = {
  auth: {
    login: "auth/login",
    signup: "auth/signup",
    logout: "auth/logout",
    checkUsername: "auth/check-username",
    verify: "auth/verify-account",
    forgotPassword: "auth/forgot-password",
  },
  user: {
    userById: (id: string) => `/user/data/${id}`,
    getProfile: "/user/me",
    updateUser: "/user/",
    deleteUser: "/user/",
    updatePassword: "/user/password",
  },
  categories: "/category/all",
  article: {
    all: "/article/all",
    byId: (id: string) => `/article/data/${id}`,
    create: "/article/new",
    update: (id: string) => `/article/${id}`,
    delete: (id: string) => `/article/${id}`,
  },
  bookmark: {
    all: "/bookmark/all",
    create: "/bookmark/new",
    delete: (id: string) => `/bookmark/${id}`,
  },
};
