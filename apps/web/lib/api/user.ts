import { apiClient } from "./client";
import type {
  UpdateProfileRequest,
  UserProfileResponse,
} from "@/types/user.types";

export const userApi = {
  getProfile: async (): Promise<UserProfileResponse> => {
    return apiClient.get("/v1/users/profile");
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UserProfileResponse> => {
    return apiClient.put("/v1/users/profile", data);
  },

  deleteAccount: async (): Promise<{ success: boolean }> => {
    return apiClient.delete("/v1/users/profile");
  },
};
