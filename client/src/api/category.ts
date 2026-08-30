import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const getCategoriesService = async () => {
  const res = await apiInstance.get(apiEndpoints.categories);
  return res.data || [];
};
