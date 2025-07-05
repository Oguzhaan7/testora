import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { notificationApi } from "@/lib/api/notifications";
import type {
  NotificationPreferences,
  EmailNotificationRequest,
} from "@/types/notification.types";

export const notificationQueryKeys = {
  notifications: (limit?: number, offset?: number) =>
    ["notifications", { limit, offset }] as const,
  preferences: () => ["notifications", "preferences"] as const,
};

export const useNotifications = (limit?: number, offset?: number) => {
  const t = useTranslations("notifications");

  return useQuery({
    queryKey: notificationQueryKeys.notifications(limit, offset),
    queryFn: () => notificationApi.getNotifications(limit, offset),
    meta: {
      errorMessage: t("errors.fetchNotifications"),
    },
  });
};

export const useNotificationPreferences = () => {
  const t = useTranslations("notifications");

  return useQuery({
    queryKey: notificationQueryKeys.preferences(),
    queryFn: () => notificationApi.getPreferences(),
    meta: {
      errorMessage: t("errors.fetchPreferences"),
    },
  });
};

export const useMarkAsRead = () => {
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      toast.success(t("messages.markedAsRead"));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.markAsRead"));
    },
  });
};

export const useMarkAllAsRead = () => {
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      toast.success(t("messages.allMarkedAsRead"));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.markAllAsRead"));
    },
  });
};

export const useUpdateNotificationPreferences = () => {
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      notificationApi.updatePreferences(preferences),
    onSuccess: () => {
      toast.success(t("messages.preferencesUpdated"));
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.preferences(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.updatePreferences"));
    },
  });
};

export const useSendEmail = () => {
  const t = useTranslations("notifications");

  return useMutation({
    mutationFn: (data: EmailNotificationRequest) =>
      notificationApi.sendEmail(data),
    onSuccess: () => {
      toast.success(t("messages.emailSent"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.emailSend"));
    },
  });
};
