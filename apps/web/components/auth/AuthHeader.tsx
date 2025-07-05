"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";

export function AuthHeader() {
  const tCommon = useTranslations("common");

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <Logo size="lg" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {tCommon("appDescription")}
      </p>
    </div>
  );
}
