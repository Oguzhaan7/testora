"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const t = useTranslations("homepage.hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6 py-16 sm:py-20 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {t("subtitle")}
        </p>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/register">
              {t("getStarted")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Play className="mr-2 h-4 w-4" />
            {t("watchDemo")}
          </Button>
        </div>
      </div>
    </section>
  );
}
