import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import { toast } from "react-toastify";

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

apiInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response, config } = error;
    const requestUrl = config?.url || "";

    if (response) {
      if (response.status === 401) {
        const isAuthRoute = requestUrl.includes("auth/");
        if (!isAuthRoute) {
          const { default: useAuthStore } = await import("@/store/authStore");
          const { currentUser, handleLogout } = useAuthStore.getState();
          if (currentUser) {
            toast.error("Your session has expired! Please login again");
            handleLogout();
          }
        }
      } else {
        const errorMessage =
          response.data?.message || "Something went wrong. Try Later";
        toast.error(errorMessage);
      }
    } else {
      toast.error("Network error");
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
