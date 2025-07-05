"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthHeader } from "./AuthHeader";

import { createAuthSchemas, type LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/auth/use-auth-queries";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const loginMutation = useLogin();

  const { loginSchema: schema } = createAuthSchemas(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "test@user.com",
      password: "123456Tt",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div>
      <AuthHeader />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("login.title")}
          </CardTitle>{" "}
          <CardDescription className="text-center">
            {t("login.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{tCommon("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{tCommon("password")}</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder")}
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loginMutation.isPending}
            >
              {" "}
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("login.loginButton")}
                </>
              ) : (
                t("login.title")
              )}
            </Button>
          </form>

          <Separator />

          <div className="text-center text-sm">
            <span className="text-gray-600">{t("login.noAccount")} </span>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {t("login.registerLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
