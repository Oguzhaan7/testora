"use client";

import { useRef } from "react";
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
import {
  Check,
  Star,
  Sparkles,
  Crown,
  Zap,
  Shield,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PricingSection() {
  const t = useTranslations("homepage.pricing");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const guaranteeRef = useRef<HTMLParagraphElement>(null);

  const plans = [
    {
      key: "free",
      popular: false,
      icon: Sparkles,
      gradient: "from-slate-500 to-slate-700",
      cardGradient: "from-slate-50 to-slate-100",
      glowColor: "slate",
      borderColor: "border-slate-200",
      textColor: "text-slate-900",
      buttonVariant: "outline" as const,
      savings: null,
    },
    {
      key: "premium",
      popular: true,
      icon: Crown,
      gradient: "from-primary to-rose-500",
      cardGradient: "from-primary/10 to-rose-500/10",
      glowColor: "primary",
      borderColor: "border-primary",
      textColor: "text-primary",
      buttonVariant: "default" as const,
      savings: "En Popüler",
    },
    {
      key: "pro",
      popular: false,
      icon: Zap,
      gradient: "from-purple-600 to-pink-600",
      cardGradient: "from-purple-50 to-pink-50",
      glowColor: "purple",
      borderColor: "border-purple-200",
      textColor: "text-purple-900",
      buttonVariant: "outline" as const,
      savings: "En İyi Değer",
    },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      badgeRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
      .fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        cardsRef.current?.children || [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        guaranteeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/10 to-rose-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 relative">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-16 lg:mb-24">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6 backdrop-blur-sm"
          >
            <DollarSign className="h-4 w-4" />
            {t("badge")}
          </div>

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-rose-500/80 to-pink-600 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl lg:text-2xl leading-relaxed text-muted-foreground font-medium max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="mx-auto grid max-w-md grid-cols-1 gap-6 sm:gap-8 md:max-w-none md:grid-cols-3 lg:gap-10 xl:gap-12"
        >
          {plans.map((plan) => {
            const IconComponent = plan.icon;

            return (
              <Card
                key={plan.key}
                className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-2 border-primary shadow-xl md:scale-[1.02] z-10"
                    : "border-2 border-border/30 hover:border-border/50 hover:shadow-lg"
                } bg-background/95 backdrop-blur-sm`}
              >
                {/* Subtle Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="bg-primary text-primary-foreground shadow-lg px-3 py-4 text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {t("popular")}
                    </Badge>
                  </div>
                )}

                {/* Savings Badge */}
                {plan.savings && (
                  <div className="absolute top-4 right-4 z-20">
                    <Badge
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm text-xs font-medium"
                    >
                      {plan.savings}
                    </Badge>
                  </div>
                )}

                {/* Simple Background */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.cardGradient}`}
                  />
                </div>

                <CardHeader className="relative text-center pb-6 pt-6 sm:pt-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.gradient} shadow-lg transition-transform duration-200 group-hover:scale-105`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-bold mb-2">
                    {t(`${plan.key}.name`)}
                  </CardTitle>

                  <CardDescription className="text-sm text-muted-foreground">
                    {t(`${plan.key}.description`)}
                  </CardDescription>

                  {/* Price */}
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {t(`${plan.key}.price`)}
                      </span>
                      {plan.key !== "free" && (
                        <span className="text-lg text-muted-foreground">
                          /{t("month")}
                        </span>
                      )}
                    </div>
                    {plan.key !== "free" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("billedMonthly")}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6 px-6 pb-8">
                  {/* Features List */}
                  <div className="space-y-3">
                    {(t.raw(`${plan.key}.features`) as string[]).map(
                      (feature: string, featureIndex: number) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm leading-5 text-foreground/90">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button
                      asChild
                      className={`w-full h-11 font-semibold transition-colors duration-200 ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : ""
                      }`}
                      variant={plan.buttonVariant}
                    >
                      <Link href="/register">{t(`${plan.key}.cta`)}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guarantee */}
        <div className="mt-16 lg:mt-24 text-center">
          <div
            ref={guaranteeRef}
            className="inline-flex items-center gap-3 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-border/30 shadow-sm"
          >
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-base text-muted-foreground font-medium">
              {t("guarantee")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
