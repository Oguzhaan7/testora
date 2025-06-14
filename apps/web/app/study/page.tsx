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
import { BookOpen, Clock, TrendingUp, Play } from "lucide-react";
import Link from "next/link";
import { useLessons, useCurrentSession, useProgress } from "@/hooks/api";

export default function StudyPage() {
  const t = useTranslations("study");
  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: currentSession } = useCurrentSession();
  const { data: progress } = useProgress();

  const breadcrumbs = [{ label: t("title") }];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("title")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
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
                    {currentSession.session.currentQuestionIndex + 1}/
                    {currentSession.session.totalQuestions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("correctAnswers")}:{" "}
                    {currentSession.session.correctAnswers}
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/study/session/${currentSession.session.id}`}>
                    {t("continue")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("totalLessons")}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessonsLoading ? "..." : lessons?.lessons?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("availableNow")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("studyTime")}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((progress?.progress?.totalTimeSpent || 0) / 60)}m
              </div>
              <p className="text-xs text-muted-foreground">{t("thisWeek")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("accuracy")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((progress?.progress?.overallAccuracy || 0) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">{t("overall")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("quickStart")}</CardTitle>
              <CardDescription>{t("quickStartDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/study/lessons">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t("browseLessons")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/plans/create">{t("createStudyPlan")}</Link>
              </Button>
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
                <div className="space-y-2">
                  <p className="text-sm">
                    {t("lastStudied")}:{" "}
                    {new Date(
                      progress.progress.lastStudyDate
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("currentStreak")}: {progress.progress.currentStreak}{" "}
                    {t("days")}
                  </p>
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
