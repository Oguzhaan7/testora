import Cookies from "js-cookie";
import { toast } from "sonner";
import type { ApiResponse, RequestConfig } from "@/types/api.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthToken = (): string | undefined => {
  return Cookies.get("auth-token");
};

export const apiClient = {
  async request<T = unknown>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestConfig = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    const token = getAuthToken();
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove("auth-token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(new Error("Unauthorized"));
        }

        if (response.status === 403) {
          toast.error("Access denied");
          throw new Error("Forbidden");
        }

        if (response.status === 429) {
          toast.error("Too many requests");
          throw new Error("Too Many Requests");
        }

        const errorData: ApiResponse = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `HTTP ${response.status}: ${response.statusText}`;

        throw new Error(errorMessage);
      }

      const data: ApiResponse<T> = await response.json();
      return (data.data || data) as T;
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Network error");
      }
      throw error;
    }
  },

  get: <T = unknown>(endpoint: string, options?: RequestConfig): Promise<T> =>
    apiClient.request<T>(endpoint, { method: "GET", ...options }),

  post: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> =>
    apiClient.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : "{}",
      ...options,
    }),

  put: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> =>
    apiClient.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),

  patch: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> =>
    apiClient.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    }),

  delete: <T = unknown>(
    endpoint: string,
    options?: RequestConfig
  ): Promise<T> =>
    apiClient.request<T>(endpoint, { method: "DELETE", ...options }),
};
