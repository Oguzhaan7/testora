"use client";

import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Target, CheckCircle, Calendar } from "lucide-react";
import { useSessionHistory } from "@/hooks/api";

export default function StudyHistoryPage() {
  const t = useTranslations("study.history");
  const { data: sessions, isLoading } = useSessionHistory();

  const breadcrumbs = [
    { label: t("study"), href: "/study" },
    { label: t("history") },
  ];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("history")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {sessions?.sessions && sessions.sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.sessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{t("sessionTitle")}</span>
                        <span className="text-sm font-normal text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(session.startedAt).toLocaleDateString()}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {session.status === "completed"
                          ? t("completed")
                          : t("inProgress")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">
                              {t("correct")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.correctAnswers}/{session.totalQuestions}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {t("accuracy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(
                                (session.correctAnswers /
                                  session.totalQuestions) *
                                  100
                              )}
                              %
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {t("duration")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.completedAt
                                ? Math.round(
                                    (new Date(session.completedAt).getTime() -
                                      new Date(session.startedAt).getTime()) /
                                      60000
                                  )
                                : "..."}
                              m
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              session.status === "completed"
                                ? "bg-green-600"
                                : session.status === "active"
                                  ? "bg-blue-600"
                                  : "bg-yellow-600"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium">{t("status")}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.status === "completed"
                                ? t("completed")
                                : session.status === "active"
                                  ? t("active")
                                  : t("paused")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">{t("noHistory")}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("noHistoryDescription")}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
