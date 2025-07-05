"use client";

import { useRouter, useParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  TrendingUp,
  BookOpen,
  RotateCcw,
  Home,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { StudySession, SessionSummary } from "@/types/question.types";

export default function SessionSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("study.session");
  const tStudy = useTranslations("study");
  const [summaryData, setSummaryData] = useState<{
    session: StudySession;
    summary: SessionSummary;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = params.id as string;

  useEffect(() => {
    // Get session data from sessionStorage (set by endSession mutation)
    const storedSessionData = sessionStorage.getItem(
      `session-summary-${sessionId}`
    );
    if (storedSessionData) {
      setSummaryData(JSON.parse(storedSessionData));
      setIsLoading(false);
    } else {
      // If no stored data, redirect back to study
      router.push("/study");
    }
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <AppLayout
        sidebarItems={appMenuItems}
        pageTitle={t("sessionSummary")}
        breadcrumbs={[
          { label: tStudy("title"), href: "/study" },
          { label: t("sessionSummary") },
        ]}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">{t("loadingSummary")}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!summaryData) {
    router.push("/study");
    return null;
  }

  const { summary } = summaryData;

  const breadcrumbs = [
    { label: tStudy("title"), href: "/study" },
    { label: t("sessionSummary") },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 80) return <Trophy className="h-6 w-6 text-green-600" />;
    if (accuracy >= 60) return <Target className="h-6 w-6 text-yellow-600" />;
    return <TrendingUp className="h-6 w-6 text-red-600" />;
  };

  const getPerformanceMessage = (accuracy: number) => {
    if (accuracy >= 80) return t("excellentPerformance");
    if (accuracy >= 60) return t("goodPerformance");
    return t("needsImprovement");
  };

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("sessionSummary")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="mb-4">{getPerformanceIcon(summary.accuracy)}</div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t("sessionCompleted")}
          </h1>
          <p className="text-muted-foreground">
            {getPerformanceMessage(summary.accuracy)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("totalQuestions")}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("correctAnswers")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.correctAnswers}
              </div>
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
              <div
                className={`text-2xl font-bold ${getPerformanceColor(summary.accuracy)}`}
              >
                {summary.accuracy}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("timeSpent")}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(summary.timeSpent)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("detailedResults")}
            </CardTitle>
            <CardDescription>{t("detailedResultsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("topicStudied")}</span>
                <Badge variant="secondary">{t("topicCompleted")}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("lesson")}</span>
                <span className="text-sm text-muted-foreground">
                  {t("lessonCompleted")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("averageTimePerQuestion")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(
                    Math.round(summary.timeSpent / summary.totalQuestions)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("completedAt")}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(summary.completedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/study/session/start")} size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            {t("studyAgain")}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/study/lessons")}
            size="lg"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            {t("browseLessons")}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            {t("backToDashboard")}
          </Button>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">
                {summary.accuracy >= 80
                  ? t("encouragementExcellent")
                  : summary.accuracy >= 60
                    ? t("encouragementGood")
                    : t("encouragementKeepTrying")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
