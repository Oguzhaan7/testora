import type { Level } from "./api.types";

export interface UserProfile {
  level?: Level;
  preferences?: {
    studyTimePerDay?: number;
    preferredHours?: string[];
    reminderSettings?: boolean;
    difficulty?: "adaptive" | "fixed";
  };
  onboarding?: {
    completed: boolean;
    currentStep: number;
  };
  avatar?: string;
}

export interface UserDetail {
  _id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  profile?: UserProfile;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profile?: UserProfile;
  timezone?: string;
}

export interface UserProfileResponse {
  user: Omit<UserDetail, "password">;
}
