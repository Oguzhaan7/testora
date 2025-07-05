"use client";

import { useTranslations } from "next-intl";

export function StatsSection() {
  const t = useTranslations("homepage.stats");

  const stats = [
    {
      value: t("studentsCount"),
      label: t("studentsLabel"),
    },
    {
      value: t("questionsCount"),
      label: t("questionsLabel"),
    },
    {
      value: t("accuracyRate"),
      label: t("accuracyLabel"),
    },
    {
      value: t("lessonsCount"),
      label: t("lessonsLabel"),
    },
  ];

  return (
    <section className="bg-primary/5 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
