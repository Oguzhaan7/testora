"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Search, Filter, Users, Clock } from "lucide-react";
import Link from "next/link";
import { useLessons } from "@/hooks/api";

export default function LessonsPage() {
  const t = useTranslations("study.lessons");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: lessons, isLoading } = useLessons(
    selectedLevel === "all" ? undefined : selectedLevel,
    selectedCategory === "all" ? undefined : selectedCategory
  );

  const breadcrumbs = [
    { label: t("study"), href: "/study" },
    { label: t("lessons") },
  ];
  const filteredLessons =
    lessons?.lessons?.filter(
      (lesson) =>
        lesson?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const levels = ["beginner", "intermediate", "advanced"];
  const categories = ["math", "science", "language", "history"];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("lessons")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>{" "}
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("selectLevel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLevels")}</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {t(`levels.${level}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`categories.${category}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("showingResults", { count: filteredLessons.length })}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">
                          {lesson.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {lesson.description}
                        </CardDescription>
                      </div>
                      <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {lesson.level}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {lesson.estimatedDuration || 30}m
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{lesson.category}</Badge>
                        <Button asChild size="sm">
                          <Link href={`/study/lessons/${lesson.id}`}>
                            {t("startLesson")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLessons.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">{t("noLessons")}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("noLessonsDescription")}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
