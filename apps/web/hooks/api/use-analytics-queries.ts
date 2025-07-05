import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { analyticsApi } from "@/lib/api/analytics";

export const analyticsQueryKeys = {
  userAnalytics: (userId: string, period: "daily" | "weekly" | "monthly") =>
    ["analytics", "user", userId, period] as const,
  globalAnalytics: (period: "daily" | "weekly" | "monthly") =>
    ["analytics", "global", period] as const,
  dailyAnalytics: (date?: string) => ["analytics", "daily", date] as const,
};

export const useUserAnalytics = (
  userId: string,
  period: "daily" | "weekly" | "monthly" = "weekly"
) => {
  const t = useTranslations("analytics");

  return useQuery({
    queryKey: analyticsQueryKeys.userAnalytics(userId, period),
    queryFn: () => analyticsApi.getUserAnalytics(userId, period),
    enabled: !!userId,
    meta: {
      errorMessage: t("errors.fetchUserAnalytics"),
    },
  });
};

export const useGlobalAnalytics = (
  period: "daily" | "weekly" | "monthly" = "weekly"
) => {
  const t = useTranslations("analytics");

  return useQuery({
    queryKey: analyticsQueryKeys.globalAnalytics(period),
    queryFn: () => analyticsApi.getGlobalAnalytics(period),
    meta: {
      errorMessage: t("errors.fetchGlobalAnalytics"),
    },
  });
};

export const useDailyAnalytics = (date?: string) => {
  const t = useTranslations("analytics");

  return useQuery({
    queryKey: analyticsQueryKeys.dailyAnalytics(date),
    queryFn: () => analyticsApi.getDailyAnalytics(date),
    meta: {
      errorMessage: t("errors.fetchDailyAnalytics"),
    },
  });
};

export const useTrackEvent = () => {
  return useMutation({
    mutationFn: ({
      eventName,
      eventData,
    }: {
      eventName: string;
      eventData: Record<string, unknown>;
    }) => analyticsApi.trackEvent(eventName, eventData),
    onError: (error: Error) => {
      console.error("Analytics tracking error:", error);
    },
  });
};
