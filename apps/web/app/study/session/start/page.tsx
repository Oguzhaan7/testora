"use client";

import { useEffect, useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Play, BookOpen, Clock, Target, Loader2 } from "lucide-react";
import Link from "next/link";
import { useStartStudySession, useTopicsByLesson } from "@/hooks/api";

export default function StartSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("study.session");
  const tStudy = useTranslations("study");
  const tLesson = useTranslations("study.lesson");

  const lessonId = searchParams.get("lesson");
  const topicId = searchParams.get("topic");
  const [hasStarted, setHasStarted] = useState(false);

  const { data: topics } = useTopicsByLesson(lessonId || "");
  const startSession = useStartStudySession();

  const breadcrumbs = [
    { label: tStudy("title"), href: "/study" },
    { label: tLesson("lessons"), href: "/study/lessons" },
    ...(lessonId
      ? [{ label: tLesson("lessonDetail"), href: `/study/lessons/${lessonId}` }]
      : []),
    { label: t("startSession") },
  ];

  const selectedTopic = topics?.topics?.find(
    (topic) => (topic._id || topic.id) === topicId
  );
  const allTopics = topics?.topics || [];

  const handleStartSession = useCallback(
    async (targetTopicId?: string) => {
      if (!targetTopicId || !lessonId || hasStarted || startSession.isPending)
        return;
      setHasStarted(true);
      try {
        const result = await startSession.mutateAsync({
          lessonId,
          topicId: targetTopicId,
          questionCount: 10,
          difficulty: "adaptive",
          sessionType: "practice",
        });
        const sessionId = result.session._id || result.session.id;
        router.push(`/study/session/${sessionId}`);
      } catch (error) {
        setHasStarted(true);
        let message = t("startError");
        const errMsg =
          (error as any)?.response?.data?.message ||
          (error as any)?.message ||
          "";
        if (
          errMsg.includes("devam eden oturum") ||
          errMsg.includes("active session")
        ) {
          message = t("activeSessionError");
        }
        toast.error(message);
        router.push("/study");
      }
    },
    [startSession, router, lessonId, hasStarted, t]
  );

  useEffect(() => {
    if (topicId && selectedTopic && !startSession.isPending && !hasStarted) {
      handleStartSession(topicId);
    }
  }, [
    topicId,
    selectedTopic,
    startSession.isPending,
    hasStarted,
    handleStartSession,
  ]);

  if (topicId && selectedTopic) {
    return (
      <AppLayout
        sidebarItems={appMenuItems}
        pageTitle={t("startSession")}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle>{t("startingSession")}</CardTitle>
              <CardDescription>
                {t("preparingQuestions", {
                  topic: selectedTopic.name || selectedTopic.title || "Topic",
                })}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("startSession")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t("sessionSettings")}
            </CardTitle>
            <CardDescription>{t("sessionSettingsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("questionCount")}</p>
                  <p className="text-sm text-muted-foreground">
                    10 {t("questions")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("estimatedTime")}</p>
                  <p className="text-sm text-muted-foreground">~15 min</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("difficulty")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("adaptive")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {t("selectTopic")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {allTopics.map((topic, index) => (
              <Card
                key={topic._id || topic.id || `topic-${index}`}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (!hasStarted && !startSession.isPending) {
                    handleStartSession(topic._id || topic.id);
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {index + 1}. {topic.name || topic.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {topic.description}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      disabled={startSession.isPending || hasStarted}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartSession(topic._id || topic.id);
                      }}
                    >
                      {startSession.isPending ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-3 w-3" />
                      )}
                      {t("start")}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {allTopics.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t("noTopics")}</h3>
              <p className="mt-2 text-muted-foreground">
                {t("noTopicsDescription")}
              </p>
              <Button asChild className="mt-4">
                <Link href="/study/lessons">{t("backToLessons")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
