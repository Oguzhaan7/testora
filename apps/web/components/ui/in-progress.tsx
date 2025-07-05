"use client";

import { Construction, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface InProgressProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  estimatedDate?: string;
  features?: string[];
}

export function InProgress({
  title,
  description,
  backHref = "/",
  backLabel,
  estimatedDate,
  features = [],
}: InProgressProps) {
  const t = useTranslations("common");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl w-fit">
            <Construction className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title || t("inProgress.title")}
          </CardTitle>
          <CardDescription className="text-lg">
            {description || t("inProgress.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {estimatedDate && (
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700">
                {t("inProgress.estimatedCompletion")}
              </p>
              <p className="text-lg font-bold text-blue-900">{estimatedDate}</p>
            </div>
          )}

          {features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                {t("inProgress.upcomingFeatures")}
              </h3>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href={backHref}>
                <ArrowRight className="h-4 w-4 rotate-180" />
                {backLabel || t("inProgress.backToHome")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
