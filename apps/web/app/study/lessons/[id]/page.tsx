"use client";

import { useParams } from "next/navigation";
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
import { BookOpen, Play, Clock, Target } from "lucide-react";
import Link from "next/link";
import { useTopicsByLesson } from "@/hooks/api";

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const t = useTranslations("study.lesson");

  const { data: topics, isLoading } = useTopicsByLesson(lessonId);

  const breadcrumbs = [
    { label: t("study"), href: "/study" },
    { label: t("lessons"), href: "/study/lessons" },
    { label: t("lessonDetail") },
  ];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("lessonDetail")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href={`/study/session/start?lesson=${lessonId}`}>
              <Play className="mr-2 h-4 w-4" />
              {t("startStudying")}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t("lessonOverview")}
            </CardTitle>
            <CardDescription>{t("lessonDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("difficulty")}</p>
                  <p className="text-sm text-muted-foreground">Intermediate</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("duration")}</p>
                  <p className="text-sm text-muted-foreground">~30 min</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("topics")}</p>
                  <p className="text-sm text-muted-foreground">
                    {topics?.topics?.length || 0} {t("topicsCount")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {t("topicsTitle")}
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topics?.topics?.map((topic, index) => (
                <Card
                  key={topic.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {index + 1}. {topic.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {topic.description}
                        </CardDescription>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/study/session/start?lesson=${lessonId}&topic=${topic.id}`}
                        >
                          <Play className="mr-2 h-3 w-3" />
                          {t("practice")}
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              )) || []}

              {(!topics?.topics || topics.topics.length === 0) && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    {t("noTopics")}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {t("noTopicsDescription")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("readyToStart")}</CardTitle>
            <CardDescription>{t("readyToStartDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button asChild>
                <Link href={`/study/session/start?lesson=${lessonId}`}>
                  <Play className="mr-2 h-4 w-4" />
                  {t("startFullLesson")}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/study/lessons">{t("backToLessons")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
