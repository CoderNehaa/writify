import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const getUserByIdService = async (userId: string): Promise<IUser> => {
  const res = await apiInstance.get(apiEndpoints.userById(userId));
  return res.data;
};

export const deleteUserByIdService = async (userId: string): Promise<IResponse<IUser>> => {
  const res = await apiInstance.delete(apiEndpoints.userById(userId));
  return res.data;
};

export const getProfileService = async (): Promise<IResponse<IUser>> => {
  const res = await apiInstance.get(apiEndpoints.getProfile);
  return res.data;
};

export const updateUserByIdService = async (
  userId: string,
  payload: FormData
): Promise<IResponse<IUser>> => {
  return await apiInstance.put(apiEndpoints.userById(userId), payload);
};
