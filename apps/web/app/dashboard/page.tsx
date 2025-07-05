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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Trophy,
  Target,
  Brain,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useUserProfile, useProgress, useSessionHistory } from "@/hooks/api";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { user } = useAuthStore();

  const { data: profile } = useUserProfile();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: sessionHistory } = useSessionHistory();

  const breadcrumbs = [{ label: t("title") }];

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const quickActions = [
    {
      key: "startStudy",
      href: "/study",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      key: "viewProgress",
      href: "/analytics",
      icon: BarChart3,
      color: "bg-green-500",
    },
    {
      key: "createPlan",
      href: "/study-plans",
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      key: "aiChat",
      href: "/ai-chat",
      icon: Brain,
      color: "bg-orange-500",
    },
  ];

  const displayUser = profile?.user ||
    user || {
      name: "User",
      email: "user@example.com",
      profile: {
        level: "1",
        avatar: undefined,
      },
    };

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const getRecentSessions = () => {
    if (!sessionHistory?.sessions) return [];
    return sessionHistory.sessions
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
      .slice(0, 3);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffInMs = now.getTime() - sessionDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h`;
    } else {
      return "1h";
    }
  };

  const statsData = [
    {
      key: "totalStudyTime",
      value: progressLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        formatStudyTime(progress?.progress?.totalTimeSpent || 0)
      ),
      icon: Clock,
      trend: "+0%",
      trendType: "up" as const,
    },
    {
      key: "completedLessons",
      value: progressLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        (progress?.progress?.totalLessonsCompleted || 0).toString()
      ),
      icon: BookOpen,
      trend: "+0",
      trendType: "up" as const,
    },
    {
      key: "currentStreak",
      value: progressLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        (progress?.progress?.currentStreak || 0).toString()
      ),
      icon: Trophy,
      trend:
        progress?.progress?.currentStreak &&
        progress.progress.currentStreak >
          (progress?.progress?.longestStreak || 0)
          ? "New!"
          : `+${progress?.progress?.currentStreak || 0}`,
      trendType: "up" as const,
    },
    {
      key: "accuracy",
      value: progressLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        `${Math.round((progress?.progress?.overallAccuracy || 0) * 100)}%`
      ),
      icon: Target,
      trend: "+0%",
      trendType: "up" as const,
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
              {t("welcome", { name: displayUser.name })}
            </h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={displayUser.profile?.avatar}
                alt={displayUser.name}
              />
              <AvatarFallback>
                {getUserInitials(displayUser.name || displayUser.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayUser.name}</p>
              <Badge variant="secondary">
                {t("level", { level: displayUser.profile?.level || "1" })}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t(`stats.${stat.key}`)}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    {stat.trend} {t("fromLastWeek")}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
              <CardDescription>{t("quickActionsDescription")}</CardDescription>
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
                        {t(`actions.${action.key}`)}
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
              <div className="space-y-4">
                {getRecentSessions().length > 0 ? (
                  getRecentSessions().map((session, index) => (
                    <div
                      key={session.id || index}
                      className="flex items-center space-x-3"
                    >
                      <div className="p-2 bg-blue-100 rounded-md">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {session.completedAt
                            ? t("completedLesson")
                            : "Started lesson"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("timeAgo", {
                            time: formatTimeAgo(session.startedAt),
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-md">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("completedLesson")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("timeAgo", { time: "2h" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-md">
                        <Trophy className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("achievedStreak")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("timeAgo", { time: "1d" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-md">
                        <Brain className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("usedAITutor")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("timeAgo", { time: "3d" })}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
