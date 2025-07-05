"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const t = useTranslations("homepage.cta");

  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
            {t("description")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/(auth)/register">
                {t("getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary-foreground/20 text-primary hover:bg-primary-foreground/10"
            >
              <Link href="/(auth)/register">{t("freeAccount")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
