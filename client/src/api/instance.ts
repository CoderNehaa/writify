import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES_PATH } from "@/utils/routesPath";
import { toast } from "react-toastify";

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

apiInstance.interceptors.request.use(
  (config) => {
    return config;
    // TODO: Add access and refresh token both
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        toast.error("Your session has expired! Please login again");
        // TODO: logout user
        toast.error("Unauthorized");
        localStorage.clear();
        sessionStorage.clear();
        if (window.location.href !== "/") {
          window.location.href = "/";
        }
        console.error(
          response.data?.message || "Something went wrong. Try Later"
        );
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
