import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/stores/auth-store";
import type { UpdateProfileRequest } from "@/types/user.types";

export const userQueryKeys = {
  profile: ["user", "profile"] as const,
};

export const useUserProfile = () => {
  const t = useTranslations("user");

  return useQuery({
    queryKey: userQueryKeys.profile,
    queryFn: userApi.getProfile,
    retry: 1,
    meta: {
      errorMessage: t("errors.profileFetch"),
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const t = useTranslations("user");
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: (data) => {
      // Convert UserDetail to User format for AuthStore
      if (data.user) {
        const userForStore = {
          _id: data.user._id,
          email: data.user.email,
          name: data.user.name,
          role: "user" as const,
          profile: {
            level: data.user.profile?.level || "beginner",
            preferences: {
              studyTimePerDay:
                data.user.profile?.preferences?.studyTimePerDay || 30,
              preferredHours:
                data.user.profile?.preferences?.preferredHours || [],
              reminderSettings:
                data.user.profile?.preferences?.reminderSettings || false,
              difficulty:
                data.user.profile?.preferences?.difficulty ||
                ("adaptive" as const),
            },
            onboarding: {
              completed: data.user.profile?.onboarding?.completed || false,
              currentStep: data.user.profile?.onboarding?.currentStep || 0,
            },
            avatar: data.user.profile?.avatar,
          },
          isEmailVerified: data.user.isEmailVerified,
          createdAt: data.user.createdAt,
        };
        updateUser(userForStore);
      }
      queryClient.setQueryData(userQueryKeys.profile, data);
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.profile,
      });
      toast.success(t("messages.profileUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.profileUpdate"));
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("user");

  return useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success(t("messages.accountDeleted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.accountDelete"));
    },
  });
};
