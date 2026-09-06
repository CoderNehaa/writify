import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const getArticlesService = async (
  filters: IArticleFilters = {}
): Promise<IArticle[]> => {
  const res: IResponse<IArticle[]> = await apiInstance.get(apiEndpoints.article.all, {
    params: filters,
  });
  return res.data || [];
};

export const getArticleByIdService = async (
  id: string
): Promise<IResponse<IArticle>> => {
  return await apiInstance.get(apiEndpoints.article.byId(id));
};

export const createArticleService = async (
  payload: FormData
): Promise<IResponse<IArticle>> => {
  return await apiInstance.post(apiEndpoints.article.create, payload);
};

export const updateArticleService = async (
  id: string,
  payload: FormData
): Promise<IResponse<IArticle>> => {
  return await apiInstance.put(apiEndpoints.article.update(id), payload);
};

export const deleteArticleService = async (
  id: string
): Promise<IResponse<IArticle>> => {
  return await apiInstance.delete(apiEndpoints.article.delete(id));
};
