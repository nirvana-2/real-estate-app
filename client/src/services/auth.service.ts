import { api } from "../api/axios";
import type { LoginPayload,currentUserResponse,RegisterPayload } from "../auth-types/auth.types";

export const loginUser = async (data: LoginPayload): Promise<currentUserResponse> => {
  // You MUST return the result of the axios call
  const res = await api.post<currentUserResponse>("/auth/login", data);
  return res.data; 
};

export const registerUser = async (data: RegisterPayload): Promise<currentUserResponse> => {
  const res = await api.post<currentUserResponse>("/auth/register", data);
  return res.data;
};

export const getMe = async (): Promise<currentUserResponse> => {
  const res = await api.get<currentUserResponse>("/auth/me");
  return res.data;
};
export const logoutUser = async (): Promise<void> => {
    await api.post("/auth/logout");
  };