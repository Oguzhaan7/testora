import { apiClient } from "./client";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types/auth.types";

export const authApi = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/v1/auth/login", data);
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/v1/auth/register", data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>("/v1/auth/logout");
  },

  me: async (): Promise<{ user: User }> => {
    return apiClient.get<{ user: User }>("/v1/auth/me");
  },

  refreshToken: async (token: string): Promise<{ token: string }> => {
    return apiClient.post<{ token: string }>("/v1/auth/refresh", { token });
  },

  sendEmailVerification: async (): Promise<void> => {
    return apiClient.post<void>("/v1/auth/send-verification");
  },

  verifyEmail: async (token: string): Promise<void> => {
    return apiClient.post<void>("/v1/auth/verify-email", { token });
  },

  resendEmailVerification: async (email: string): Promise<void> => {
    return apiClient.post<void>("/v1/auth/resend-verification", { email });
  },

  forgotPassword: async (email: string): Promise<void> => {
    return apiClient.post<void>("/v1/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    return apiClient.post<void>("/v1/auth/reset-password", { token, password });
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    return apiClient.post<void>("/v1/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};
