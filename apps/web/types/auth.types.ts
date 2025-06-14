export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  profile: {
    level: string;
    preferences: {
      studyTimePerDay: number;
      preferredHours: string[];
      reminderSettings: boolean;
      difficulty: "adaptive" | "fixed";
    };
    onboarding: {
      completed: boolean;
      currentStep: number;
    };
    avatar?: string;
  };
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}
