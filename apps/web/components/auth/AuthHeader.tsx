"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function AuthHeader() {
  const tCommon = useTranslations("common");

  return (
    <div className="text-center mb-8">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">{tCommon("appName")}</h1>
      <p className="mt-2 text-sm text-gray-600">{tCommon("appDescription")}</p>
    </div>
  );
}
