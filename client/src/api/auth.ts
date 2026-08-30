import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const signinService = async (
  payload: ISignInPayload
): Promise<IResponse<IUser>> => {
  return await apiInstance.post(apiEndpoints.login, payload);
};

export const signupService = async (
  payload: ISignUpPayload
): Promise<IResponse<IUser>> => {
  return await apiInstance.post(apiEndpoints.signup, payload);
};

export const logOutService = async () => {
  return await apiInstance.post(apiEndpoints.logout);
};

export const checkUsernameService = async (username: string) => {
  const res = await apiInstance.post(apiEndpoints.checkUsername, {
    username,
  });
  return res.data.usernameAvailable;
};

export const verifyAccountService = async (
  payload: IVerifyPayload
): Promise<IResponse<IUser>> => {
  return await apiInstance.post(apiEndpoints.verify, payload);
};
