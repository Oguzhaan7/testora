import { z } from "zod";

export const createAuthSchemas = (t: (key: string) => string) => {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    password: z
      .string()
      .min(6, t("validation.passwordMinLength"))
      .max(100, t("validation.passwordMaxLength")),
  });

  const registerSchema = z
    .object({
      name: z
        .string()
        .min(2, t("validation.nameMinLength"))
        .max(50, t("validation.nameMaxLength")),
      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .email(t("validation.emailInvalid")),
      password: z
        .string()
        .min(6, t("validation.passwordMinLength"))
        .max(100, t("validation.passwordMaxLength"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.passwordStrength")
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsNotMatch"),
      path: ["confirmPassword"],
    });

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
  });

  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(6, t("validation.passwordMinLength"))
        .max(100, t("validation.passwordMaxLength"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.passwordStrength")
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsNotMatch"),
      path: ["confirmPassword"],
    });
  const changePasswordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, t("validation.currentPasswordRequired")),
      newPassword: z
        .string()
        .min(6, t("validation.passwordMinLength"))
        .max(100, t("validation.passwordMaxLength"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.passwordStrength")
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordsNotMatch"),
      path: ["confirmPassword"],
    });

  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
  };
};

export type LoginFormData = z.infer<
  ReturnType<typeof createAuthSchemas>["loginSchema"]
>;
export type RegisterFormData = z.infer<
  ReturnType<typeof createAuthSchemas>["registerSchema"]
>;
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createAuthSchemas>["forgotPasswordSchema"]
>;
export type ResetPasswordFormData = z.infer<
  ReturnType<typeof createAuthSchemas>["resetPasswordSchema"]
>;
export type ChangePasswordFormData = z.infer<
  ReturnType<typeof createAuthSchemas>["changePasswordSchema"]
>;
