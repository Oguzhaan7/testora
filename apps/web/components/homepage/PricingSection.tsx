"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Crown, Zap } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const t = useTranslations("homepage.pricing");

  const plans = [
    {
      key: "free",
      popular: false,
      icon: Sparkles,
      gradient: "from-slate-100 to-slate-200",
      borderColor: "border-slate-200",
      textColor: "text-slate-900",
      buttonVariant: "outline" as const,
    },
    {
      key: "premium",
      popular: true,
      icon: Crown,
      gradient: "from-primary/10 to-primary/20",
      borderColor: "border-primary",
      textColor: "text-primary",
      buttonVariant: "default" as const,
    },
    {
      key: "pro",
      popular: false,
      icon: Zap,
      gradient: "from-purple-100 to-purple-200",
      borderColor: "border-purple-200",
      textColor: "text-purple-900",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 bg-gradient-to-b from-background to-slate-50/50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            {t("badge")}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-lg grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.key}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary shadow-2xl scale-105 ring-2 ring-primary/20"
                    : "hover:scale-105 border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {t("popular")}
                    </Badge>
                  </div>
                )}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`}
                />

                <CardHeader className="relative text-center pb-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${plan.gradient} mx-auto mb-4`}
                  >
                    <IconComponent className={`h-8 w-8 ${plan.textColor}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">
                    {t(`${plan.key}.name`)}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t(`${plan.key}.description`)}
                  </CardDescription>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-foreground tracking-tight">
                        {t(`${plan.key}.price`)}
                      </span>
                      {plan.key !== "free" && (
                        <span className="text-lg font-medium text-muted-foreground">
                          / {t("month")}
                        </span>
                      )}
                    </div>
                    {plan.key !== "free" && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("billedMonthly")}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  <div className="space-y-4">
                    {(t.raw(`${plan.key}.features`) as string[]).map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium leading-6">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      asChild
                      className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                          : ""
                      }`}
                      variant={plan.buttonVariant}
                    >
                      <Link href="/(auth)/register">
                        {t(`${plan.key}.cta`)}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-muted-foreground">{t("guarantee")}</p>
        </div>
      </div>
    </section>
  );
}
