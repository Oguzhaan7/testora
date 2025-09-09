"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Calendar,
  TrendingUp,
  Zap,
  Globe,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const featureIcons = {
  aiPowered: Brain,
  smartPlanning: Calendar,
  progressTracking: TrendingUp,
  adaptiveLearning: Zap,
  multiLanguage: Globe,
  expertContent: BookOpen,
};

export function FeaturesSection() {
  const t = useTranslations("homepage.features");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      key: "aiPowered",
      icon: featureIcons.aiPowered,
      gradient: "from-blue-500 to-purple-600",
      color: "text-blue-500",
    },
    {
      key: "smartPlanning",
      icon: featureIcons.smartPlanning,
      gradient: "from-green-500 to-emerald-600",
      color: "text-green-500",
    },
    {
      key: "progressTracking",
      icon: featureIcons.progressTracking,
      gradient: "from-orange-500 to-red-600",
      color: "text-orange-500",
    },
    {
      key: "adaptiveLearning",
      icon: featureIcons.adaptiveLearning,
      gradient: "from-yellow-500 to-orange-600",
      color: "text-yellow-500",
    },
    {
      key: "multiLanguage",
      icon: featureIcons.multiLanguage,
      gradient: "from-purple-500 to-pink-600",
      color: "text-purple-500",
    },
    {
      key: "expertContent",
      icon: featureIcons.expertContent,
      gradient: "from-teal-500 to-cyan-600",
      color: "text-teal-500",
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
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        cardsRef.current?.children || [],
        { y: 80, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.2"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Features</span>
            </div>
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
            className="text-xl lg:text-2xl leading-relaxed text-muted-foreground font-medium"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.key}
                className={`group relative overflow-hidden border border-border/20 bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-3 hover:rotate-1 ${
                  index === 1 ? "md:translate-y-8" : ""
                } ${index === 2 ? "lg:translate-y-4" : ""} ${index === 4 ? "md:translate-y-4" : ""}`}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0 group-hover:animate-pulse"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20px 20px, ${feature.color.replace("text-", "rgba(").replace("-500", ", 0.3)")} 2px, transparent 0)`,
                      backgroundSize: "40px 40px",
                      transform: "rotate(-45deg) scale(2)",
                      transition: "transform 0.7s ease-out",
                    }}
                  />
                </div>

                {/* Card Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-700`}
                />

                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 group-hover:scale-105`}
                />

                {/* Floating Orb */}
                <div
                  className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-700 group-hover:scale-150`}
                />

                <div className="relative p-8">
                  {/* Icon Section */}
                  <div className="mb-8">
                    <div className="relative">
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${feature.gradient} shadow-2xl group-hover:shadow-3xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}
                      >
                        <Icon className="h-10 w-10 text-white relative z-10" />

                        {/* Icon Background Animation */}
                        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-3xl" />
                      </div>

                      {/* Floating Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center text-xs font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                        {t(`${feature.key}.title`)}
                      </h3>
                      <ArrowRight className="h-6 w-6 text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:text-primary transition-all duration-500 flex-shrink-0 ml-2" />
                    </div>

                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      {t(`${feature.key}.description`)}
                    </p>

                    {/* Progress Bar Animation */}
                    <div className="mt-6 pt-4 border-t border-border/20">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1 bg-border/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${feature.gradient} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        >
                          {85 + index * 2}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
