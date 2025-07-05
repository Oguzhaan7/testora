"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Calendar,
  TrendingUp,
  Zap,
  Globe,
  BookOpen,
} from "lucide-react";

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

  const features = [
    {
      key: "aiPowered",
      icon: featureIcons.aiPowered,
    },
    {
      key: "smartPlanning",
      icon: featureIcons.smartPlanning,
    },
    {
      key: "progressTracking",
      icon: featureIcons.progressTracking,
    },
    {
      key: "adaptiveLearning",
      icon: featureIcons.adaptiveLearning,
    },
    {
      key: "multiLanguage",
      icon: featureIcons.multiLanguage,
    },
    {
      key: "expertContent",
      icon: featureIcons.expertContent,
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-16 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.key}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">
                        {t(`${feature.key}.title`)}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t(`${feature.key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
