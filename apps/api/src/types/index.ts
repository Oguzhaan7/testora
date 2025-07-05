export * from "./auth";
export * from "./user";
export * from "./api";
export * from "./errors";
export * from "./oauth";
export * from "./ai.types";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token: string;
}

export interface JWTPayload {
  userId: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profile?: {
    level?:
      | "primary"
      | "highschool"
      | "university"
      | "beginner"
      | "intermediate"
      | "advanced";
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

export interface StartStudySessionRequest {
  lessonId: string;
  topicId: string;
  sessionType: "practice" | "test" | "review";
  questionCount?: number;
  difficulty?: "easy" | "medium" | "hard";
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  selectedOption: string | number;
  timeSpent: number;
  hintsUsed?: number;
}

export interface CreateStudyPlanRequest {
  month: string;
  title: string;
  description?: string;
  goals: {
    targetDate: Date;
    examType?: string;
    targetScore?: number;
  };
  planItems: {
    lessonId: string;
    topicId: string;
    targetDate: Date;
    duration: number;
    priority: "low" | "medium" | "high";
  }[];
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class AuthenticationError extends Error {
  statusCode = 401;
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
