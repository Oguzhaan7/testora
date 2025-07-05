"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { NavigationMenu } from "./NavigationMenu";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export function AuthenticatedHeader() {
  const t = useTranslations("layout");
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center space-x-2"
            >
              <Logo size="md" />
            </Link>

            {isAuthenticated && <NavigationMenu />}
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            {isAuthenticated && user ? (
              <UserProfileDropdown user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("signIn")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{t("signUp")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
