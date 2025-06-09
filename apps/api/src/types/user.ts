import { IUser } from "@/models/User";

export interface UpdateProfileRequest {
  name?: string;
  profile?: {
    level?: "beginner" | "intermediate" | "advanced";
    preferences?: {
      studyTimePerDay?: number;
      preferredHours?: string[];
      reminderSettings?: boolean;
      difficulty?: "adaptive" | "fixed";
    };
    avatar?: string;
  };
  timezone?: string;
}

export interface UserProfileResponse {
  user: Omit<IUser, "password">;
}
