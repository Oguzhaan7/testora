import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { oauthApi } from "@/lib/api/oauth";
import { useAuthStore } from "@/stores/auth-store";
import type { GoogleSignInData, AppleSignInData } from "@/lib/api/oauth";
import type { AuthResponse } from "@/types/auth.types";

export const useGoogleAuth = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const t = useTranslations("auth.oauth");

  return useMutation({
    mutationFn: (data: GoogleSignInData) => oauthApi.googleSignIn(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      toast.success(t("messages.loginSuccess"));
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.loginFailed"));
    },
  });
};

export const useAppleAuth = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const t = useTranslations("auth.oauth");

  return useMutation({
    mutationFn: (data: AppleSignInData) => oauthApi.appleSignIn(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      toast.success(t("messages.loginSuccess"));
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.loginFailed"));
    },
  });
};
