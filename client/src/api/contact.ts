import { apiEndpoints } from "@/constants/endpoints";
import apiInstance from "./instance";

export interface IContactPayload {
  name: string;
  email: string;
  message: string;
}

export const sendContactMessageService = async (
  payload: IContactPayload
): Promise<IResponse<null>> => {
  return await apiInstance.post(apiEndpoints.contact, payload);
};
