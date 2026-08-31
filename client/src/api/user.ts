import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const getUserByIdService = async (
  userId: string
): Promise<IResponse<IUser>> => {
  return await apiInstance.get(apiEndpoints.user.userById(userId));
};

export const deleteUserService = async (): Promise<IResponse<IUser>> => {
  return await apiInstance.delete(apiEndpoints.user.deleteUser);
};

export const getProfileService = async (): Promise<IResponse<IUser>> => {
  return await apiInstance.get(apiEndpoints.user.getProfile);
};

export const updateUserByIdService = async (
  payload: FormData
): Promise<IResponse<IUser>> => {
  return await apiInstance.put(apiEndpoints.user.updateUser, payload);
};

export const updatePasswordService = async (
  newPassword: string
): Promise<IResponse<IUser>> => {
  return await apiInstance.patch(apiEndpoints.user.updatePassword, {
    newPassword,
  });
};
