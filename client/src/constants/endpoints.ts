export const apiEndpoints = {
  login: "auth/login",
  signup: "auth/signup",
  logout: "auth/logout",
  checkUsername: "auth/check-username",
  verify: "auth/verify-account",
  userById: (id: string) => `/user/${id}`,
  getProfile: "/user/me",
  categories: "/category/all",
};
