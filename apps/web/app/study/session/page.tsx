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
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Clock, Target, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCurrentSession } from "@/hooks/api";

export default function StudySessionPage() {
  const t = useTranslations("study.session");
  const { data: currentSession, isLoading } = useCurrentSession();

  const breadcrumbs = [
    { label: t("study"), href: "/study" },
    { label: t("session") },
  ];

  if (isLoading) {
    return (
      <AppLayout
        sidebarItems={appMenuItems}
        pageTitle={t("session")}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!currentSession?.session) {
    return (
      <AppLayout
        sidebarItems={appMenuItems}
        pageTitle={t("session")}
        breadcrumbs={breadcrumbs}
      >
        <div className="space-y-6">
          <div className="text-center py-12">
            <Play className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {t("noActiveSession")}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {t("noActiveSessionDescription")}
            </p>
            <div className="mt-6 space-x-4">
              <Button asChild>
                <Link href="/study/lessons">{t("startNewSession")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/study">{t("backToStudy")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const session = currentSession.session;
  const progressPercent = Math.round(
    (session.currentQuestionIndex / session.totalQuestions) * 100
  );

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("activeSession")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("activeSession")}
            </h1>
            <p className="text-muted-foreground">{t("sessionInProgress")}</p>
          </div>
          <Button asChild>
            <Link href={`/study/session/${session.id}`}>
              <Play className="mr-2 h-4 w-4" />
              {t("continueSession")}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("sessionProgress")}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {session.currentQuestionIndex + 1} / {session.totalQuestions}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {progressPercent}% {t("completed")}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("correctAnswers")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {session.correctAnswers}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("outOf")} {session.currentQuestionIndex}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("accuracy")}
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {session.currentQuestionIndex > 0
                  ? Math.round(
                      (session.correctAnswers / session.currentQuestionIndex) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {t("currentAccuracy")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("timeElapsed")}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (Date.now() - new Date(session.startedAt).getTime()) / 60000
                )}
                m
              </div>
              <p className="text-xs text-muted-foreground">
                {t("since")} {new Date(session.startedAt).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("sessionActions")}</CardTitle>
            <CardDescription>{t("sessionActionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button asChild>
              <Link href={`/study/session/${session.id}`}>
                <Play className="mr-2 h-4 w-4" />
                {t("continueSession")}
              </Link>
            </Button>
            <Button variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              {t("pauseSession")}
            </Button>
            <Button variant="destructive">
              <Square className="mr-2 h-4 w-4" />
              {t("endSession")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
