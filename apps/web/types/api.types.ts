export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Level Types
export type Level =
  | "primary"
  | "highschool"
  | "university"
  | "beginner"
  | "intermediate"
  | "advanced";

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "essay";
export type Difficulty = "easy" | "medium" | "hard";
export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "completed" | "skipped";
export type StudyPlanStatus = "active" | "paused" | "completed";
