import { apiClient } from "./client";
import type {
  UserAnalytics,
  GlobalAnalytics,
  AnalyticsResponse,
  DailyAnalytics,
} from "@/types/analytics.types";

export const analyticsApi = {
  getUserAnalytics: async (
    userId: string,
    period: "daily" | "weekly" | "monthly" = "weekly"
  ): Promise<{ analytics: UserAnalytics }> => {
    return apiClient.get<{ analytics: UserAnalytics }>(
      `/v1/analytics/user/${userId}?period=${period}`
    );
  },

  getGlobalAnalytics: async (
    period: "daily" | "weekly" | "monthly" = "weekly"
  ): Promise<{ analytics: GlobalAnalytics }> => {
    return apiClient.get<{ analytics: GlobalAnalytics }>(
      `/v1/analytics/global?period=${period}`
    );
  },

  getDailyAnalytics: async (
    date?: string
  ): Promise<{ analytics: DailyAnalytics }> => {
    const params = date ? `?date=${date}` : "";
    return apiClient.get<{ analytics: DailyAnalytics }>(
      `/v1/analytics/daily${params}`
    );
  },

  trackEvent: async (
    eventName: string,
    eventData: Record<string, unknown>
  ): Promise<AnalyticsResponse> => {
    return apiClient.post<AnalyticsResponse>("/v1/analytics/track", {
      eventName,
      eventData,
    });
  },
};
