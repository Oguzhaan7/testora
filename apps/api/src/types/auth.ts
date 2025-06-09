import { IUser } from "@/models/User";

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
  user: Omit<IUser, "password">;
  token: string;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
