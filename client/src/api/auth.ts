import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export const signinService = async (
  payload: ISignInPayload
): Promise<IResponse<ILoginResponseData>> => {
  return await apiInstance.post(apiEndpoints.auth.login, payload);
};

export const signupService = async (
  payload: ISignUpPayload
): Promise<IResponse<IUser>> => {
  return await apiInstance.post(apiEndpoints.auth.signup, payload);
};

export const logOutService = async () => {
  return await apiInstance.post(apiEndpoints.auth.logout);
};

export const checkUsernameService = async (username: string) => {
  const res: IResponse<{ usernameAvailable: boolean }> =
    await apiInstance.post(apiEndpoints.auth.checkUsername, {
      username,
    });
  return res.data?.usernameAvailable ?? false;
};

export const verifyAccountService = async (
  payload: IVerifyPayload
): Promise<IResponse<IUser>> => {
  return await apiInstance.post(apiEndpoints.auth.verify, payload);
};

export const forgotPasswordService = async (
  email: string
): Promise<IResponse<IUser>> => {
  return await apiInstance.post(apiEndpoints.auth.forgotPassword, { email });
};
