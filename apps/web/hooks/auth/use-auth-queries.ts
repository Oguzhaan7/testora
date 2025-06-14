import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export const useLogin = () => {
  const router = useRouter();
  const t = useTranslations("auth");
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      Cookies.set("auth-token", data.token, { expires: 7 });
      setAuth(data.user, data.token);
      toast.success(t("login.success"));
      router.push("/dashboard");
    },
    onError: () => {
      toast.error(t("login.error"));
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(t("register.success"));
      router.push("/verify-email");
    },
    onError: () => {
      toast.error(t("register.error"));
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("auth");
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success(t("logout.success"));
      router.push("/login");
    },
    onError: () => {
      logout();
      queryClient.clear();
      router.push("/login");
    },
  });
};

export const useMe = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await authApi.me();
      const token = Cookies.get("auth-token");
      if (token) {
        setAuth(data.user, token);
      }
      return data.user;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSendEmailVerification = () => {
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: authApi.sendEmailVerification,
    onSuccess: () => {
      toast.success(t("verification.sent"));
    },
    onError: () => {
      toast.error(t("verification.error"));
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success(t("verification.success"));
      router.push("/dashboard");
    },
    onError: () => {
      toast.error(t("verification.invalid"));
    },
  });
};

export const useResendEmailVerification = () => {
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: authApi.resendEmailVerification,
    onSuccess: () => {
      toast.success(t("verification.resent"));
    },
    onError: () => {
      toast.error(t("verification.resendError"));
    },
  });
};

export const useForgotPassword = () => {
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success(t("forgotPassword.sent"));
    },
    onError: () => {
      toast.error(t("forgotPassword.error"));
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success(t("resetPassword.success"));
      router.push("/login");
    },
    onError: () => {
      toast.error(t("resetPassword.error"));
    },
  });
};

export const useChangePassword = () => {
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success(t("changePassword.success"));
    },
    onError: () => {
      toast.error(t("changePassword.error"));
    },
  });
};
