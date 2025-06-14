import { apiClient } from "./client";
import type { AuthResponse } from "@/types/auth.types";

export interface GoogleSignInData {
  idToken: string;
}

export interface AppleSignInData {
  identityToken: string;
  user?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
    email?: string;
  };
}

export const oauthApi = {
  googleSignIn: async (data: GoogleSignInData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/v1/oauth/google", data);
  },

  appleSignIn: async (data: AppleSignInData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/v1/oauth/apple", data);
  },
};
