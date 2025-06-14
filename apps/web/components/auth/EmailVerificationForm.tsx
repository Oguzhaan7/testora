"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useVerifyEmail,
  useResendEmailVerification,
} from "@/hooks/auth/use-auth-queries";

export function EmailVerificationForm() {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "resend"
  >("loading");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("auth");

  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendEmailVerification();

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token, {
        onSuccess: () => {
          setStatus("success");
        },
        onError: () => {
          setStatus("error");
        },
      });
    } else {
      setStatus("resend");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResendVerification = () => {
    const email = localStorage.getItem("pendingVerificationEmail");
    if (email) {
      resendVerificationMutation.mutate(email);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center space-y-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">
                {t("verification.verifying")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("verification.verifyingDescription")}
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center space-y-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold">
                {t("verification.success")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("verification.successDescription")}
              </p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center space-y-4 text-center">
            <XCircle className="h-12 w-12 text-red-600" />
            <div>
              <h2 className="text-lg font-semibold">
                {t("verification.error")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("verification.errorDescription")}
              </p>
            </div>
            <Button
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending}
            >
              {resendVerificationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("verification.resending")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t("verification.resendButton")}
                </>
              )}
            </Button>
          </div>
        );

      case "resend":
        return (
          <div className="flex flex-col items-center space-y-4 text-center">
            <Mail className="h-12 w-12 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">
                {t("verification.checkEmail")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("verification.checkEmailDescription")}
              </p>
            </div>
            <Button
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending}
              variant="outline"
            >
              {resendVerificationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("verification.resending")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t("verification.resendButton")}
                </>
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{t("verification.title")}</CardTitle>
        <CardDescription>{t("verification.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">{renderContent()}</CardContent>
    </Card>
  );
}
