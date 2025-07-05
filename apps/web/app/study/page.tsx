"use client";

import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, Play, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { useLessons, useCurrentSession, useProgress } from "@/hooks/api";

export default function StudyPage() {
  const t = useTranslations("study");
  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: currentSession } = useCurrentSession();
  const { data: progress } = useProgress();

  const breadcrumbs = [{ label: t("title") }];

  const statsData = [
    {
      key: "totalLessons",
      value: lessonsLoading
        ? "..."
        : (lessons?.lessons?.length || 0).toString(),
      icon: BookOpen,
      subtitle: t("availableNow"),
    },
    {
      key: "studyTime",
      value: `${Math.round((progress?.progress?.totalTimeSpent || 0) / 60)}m`,
      icon: Clock,
      subtitle: t("thisWeek"),
    },
    {
      key: "accuracy",
      value: `${Math.round((progress?.progress?.overallAccuracy || 0) * 100)}%`,
      icon: Target,
      subtitle: t("overall"),
    },
  ];

  const quickActions = [
    {
      key: "browseLessons",
      href: "/study/lessons",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      key: "createStudyPlan",
      href: "/study-plans/create",
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("title")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("welcome")}
            </h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/study/lessons">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("browseLessons")}
            </Link>
          </Button>
        </div>

        {currentSession?.session && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {t("continueSession")}
              </CardTitle>
              <CardDescription>{t("activeSessionDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">
                    {t("progress")}:{" "}
                    {(currentSession.session.questionsAttempted || 0) + 1}/{10}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("correctAnswers")}:{" "}
                    {currentSession.session.correctAnswers}
                  </p>
                </div>
                <Button asChild>
                  <Link
                    href={`/study/session/${currentSession.session._id || currentSession.session.id}`}
                  >
                    {t("continue")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t(stat.key)}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("quickStart")}</CardTitle>
              <CardDescription>{t("quickStartDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.key}
                      variant="outline"
                      className="justify-start h-12"
                      asChild
                    >
                      <Link href={action.href}>
                        <div className={`p-2 rounded-md ${action.color} mr-3`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {t(action.key)}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("recentActivity")}</CardTitle>
              <CardDescription>
                {t("recentActivityDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {progress?.progress?.lastStudyDate ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("lastStudied")}:{" "}
                        {new Date(
                          progress.progress.lastStudyDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("currentStreak")}: {progress.progress.currentStreak}{" "}
                        {t("days")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("noRecentActivity")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
