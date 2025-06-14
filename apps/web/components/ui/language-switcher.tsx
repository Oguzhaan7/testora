"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const switchLanguage = () => {
    const nextLocale = locale === "tr" ? "en" : "tr";

    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      localStorage.setItem("locale", nextLocale);
      window.location.reload();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLanguage}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {locale === "tr" ? "EN" : "TR"}
    </Button>
  );
}
