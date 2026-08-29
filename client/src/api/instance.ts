import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES_PATH } from "@/utils/routesPath";
import { toast } from "react-toastify";

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000,
});

apiInstance.interceptors.request.use(
  (config) => {
    return config;
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
        toast.error("Unauthorized");
        localStorage.clear();
        if (window.location.href !== "/") {
          window.location.href = ROUTES_PATH.AUTH.LOGIN;
        }
        console.error(
          response.data?.message || "Something went wrong. Try Later"
        );
      } else if (response.status === 400) {
        const errorMessage =
          response.data?.message || "Something went wrong. Try Later";
        toast.error(errorMessage);
      } else {
        console.error(
          response.data?.message || "Something went wrong. Try Later"
        );
      }
    } else {
      toast.error("Network error");
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
