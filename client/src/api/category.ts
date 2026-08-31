import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const getCategoriesService = async (): Promise<ICategory[]> => {
  const res: IResponse<ICategory[]> = await apiInstance.get(
    apiEndpoints.categories
  );
  return res.data || [];
};
