"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  ArrowRight,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useSubmitAnswer, useEndSession } from "@/hooks/api";
import { useAdminQuestions } from "@/hooks/api/use-admin-queries";
import { useCurrentSession } from "@/hooks/api/use-study-queries";

export default function ActiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const t = useTranslations("study.session");
  const tStudy = useTranslations("study");

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const { data: sessionData } = useCurrentSession();
  const session = sessionData?.session;
  const topicId = session?.topicId;

  const { data: questionsData, isLoading } = useAdminQuestions(topicId || "");
  const questions = questionsData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const submitAnswer = useSubmitAnswer();
  const endSession = useEndSession();

  // Timer effect
  useEffect(() => {
    if (!isAnswered) {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAnswered]);

  const breadcrumbs = [
    { label: tStudy("title"), href: "/study" },
    { label: t("activeSession") },
  ];

  const handleAnswerSelect = (answerId: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answerId);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    try {
      const result = await submitAnswer.mutateAsync({
        sessionId,
        questionId: currentQuestion._id || currentQuestion.id,
        selectedOption: selectedAnswer,
        timeSpent,
      });

      setIsAnswered(true);

      if (result.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      handleEndSession();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setIsAnswered(false);
      setTimeSpent(0);
    }
  };

  const handleEndSession = async () => {
    try {
      const result = await endSession.mutateAsync(sessionId);
      // Store session summary data for the summary page
      sessionStorage.setItem(
        `session-summary-${sessionId}`,
        JSON.stringify(result)
      );
      router.push(`/study/session/${sessionId}/summary`);
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnswerIcon = (answerId: string, isCorrect?: boolean) => {
    if (!isAnswered || selectedAnswer !== answerId) return null;

    if (isCorrect) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getAnswerStyle = (answerId: string, isCorrect?: boolean) => {
    if (!isAnswered) {
      return selectedAnswer === answerId
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-gray-300";
    }

    if (selectedAnswer === answerId) {
      return isCorrect
        ? "border-green-500 bg-green-50"
        : "border-red-500 bg-red-50";
    }

    return "border-gray-200 opacity-60";
  };

  if (isLoading) {
    return (
      <AppLayout
        sidebarItems={appMenuItems}
        pageTitle={t("activeSession")}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t("loadingQuestion")}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const question = currentQuestion;
  if (!question) {
    return (
      <AppLayout
        sidebarItems={appMenuItems}
        pageTitle={t("activeSession")}
        breadcrumbs={breadcrumbs}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noQuestion")}</p>
          <Button onClick={() => router.push("/study")} className="mt-4">
            {t("backToStudy")}
          </Button>
        </div>
      </AppLayout>
    );
  }

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle={t("activeSession")}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t("question")} {currentQuestionIndex + 1} {t("of")}{" "}
                  {totalQuestions}
                </CardTitle>
                <CardDescription>
                  {t("correctAnswers")}: {correctAnswers} /{" "}
                  {currentQuestionIndex + (isAnswered ? 1 : 0)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">
                    {formatTime(timeSpent)}
                  </span>
                </div>
                <Badge variant="outline">
                  {Math.round(
                    (correctAnswers / Math.max(currentQuestionIndex, 1)) * 100
                  )}
                  % {t("accuracy")}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.questionText || question.question}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{question.difficulty}</Badge>
              <Badge variant="outline">
                {question.questionType || question.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options?.map((option: string, index: number) => (
                <div
                  key={`${question._id || question.id}-option-${index}`}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getAnswerStyle(
                    option,
                    submitAnswer.data?.isCorrect && selectedAnswer === option
                  )}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                    {getAnswerIcon(
                      option,
                      submitAnswer.data?.isCorrect && selectedAnswer === option
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isAnswered && submitAnswer.data && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    {submitAnswer.data.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium mb-2">
                      {submitAnswer.data.isCorrect
                        ? t("correct")
                        : t("incorrect")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submitAnswer.data.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={() => router.push("/study")}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("exitSession")}
              </Button>

              <div className="flex gap-2">
                {!isAnswered ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer || submitAnswer.isPending}
                  >
                    {submitAnswer.isPending
                      ? t("submitting")
                      : t("submitAnswer")}
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex + 1 >= totalQuestions ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        {t("finishSession")}
                      </>
                    ) : (
                      <>
                        {t("nextQuestion")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
