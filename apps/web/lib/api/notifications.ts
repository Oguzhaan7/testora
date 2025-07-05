import { apiClient } from "./client";
import type {
  Notification,
  NotificationPreferences,
  EmailNotificationRequest,
  EmailNotificationResponse,
  NotificationResponse,
} from "@/types/notification.types";

export const notificationApi = {
  getNotifications: async (
    limit?: number,
    offset?: number
  ): Promise<{ notifications: Notification[] }> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<{ notifications: Notification[] }>(
      `/v1/notifications${query}`
    );
  },

  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    return apiClient.patch<NotificationResponse>(
      `/v1/notifications/${notificationId}/read`
    );
  },

  markAllAsRead: async (): Promise<NotificationResponse> => {
    return apiClient.patch<NotificationResponse>(
      "/v1/notifications/mark-all-read"
    );
  },

  getPreferences: async (): Promise<{
    preferences: NotificationPreferences;
  }> => {
    return apiClient.get<{ preferences: NotificationPreferences }>(
      "/v1/notifications/preferences"
    );
  },

  updatePreferences: async (
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationResponse> => {
    return apiClient.put<NotificationResponse>(
      "/v1/notifications/preferences",
      preferences
    );
  },

  sendEmail: async (
    data: EmailNotificationRequest
  ): Promise<EmailNotificationResponse> => {
    return apiClient.post<EmailNotificationResponse>(
      "/v1/notifications/email",
      data
    );
  },
};
