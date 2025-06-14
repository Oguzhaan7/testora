import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { studyApi } from "@/lib/api/study";
import type {
  StartStudySessionData,
  SubmitAnswerData,
} from "@/types/question.types";

export const studyQueryKeys = {
  lessons: (level?: string, category?: string) =>
    ["study", "lessons", { level, category }] as const,
  topics: (lessonId: string) => ["study", "topics", lessonId] as const,
  session: (sessionId?: string) => ["study", "session", sessionId] as const,
  currentSession: () => ["study", "session", "current"] as const,
  question: (sessionId: string) => ["study", "question", sessionId] as const,
  progress: () => ["study", "progress"] as const,
  sessionHistory: () => ["study", "sessions", "history"] as const,
};

export const useLessons = (level?: string, category?: string) => {
  const t = useTranslations("study");

  return useQuery({
    queryKey: studyQueryKeys.lessons(level, category),
    queryFn: () => studyApi.getLessons(level, category),
    meta: {
      errorMessage: t("errors.lessonsFetch"),
    },
  });
};

export const useTopicsByLesson = (lessonId: string) => {
  const t = useTranslations("study");

  return useQuery({
    queryKey: studyQueryKeys.topics(lessonId),
    queryFn: () => studyApi.getTopicsByLesson(lessonId),
    enabled: !!lessonId,
    meta: {
      errorMessage: t("errors.topicsFetch"),
    },
  });
};

export const useCurrentSession = () => {
  const t = useTranslations("study");

  return useQuery({
    queryKey: studyQueryKeys.currentSession(),
    queryFn: studyApi.getCurrentSession,
    meta: {
      errorMessage: t("errors.sessionFetch"),
    },
  });
};

export const useSessionQuestion = (sessionId: string) => {
  const t = useTranslations("study");

  return useQuery({
    queryKey: studyQueryKeys.question(sessionId),
    queryFn: () => studyApi.getSessionQuestion(sessionId),
    enabled: !!sessionId,
    meta: {
      errorMessage: t("errors.questionFetch"),
    },
  });
};

export const useProgress = () => {
  const t = useTranslations("study");

  return useQuery({
    queryKey: studyQueryKeys.progress(),
    queryFn: studyApi.getProgress,
    meta: {
      errorMessage: t("errors.progressFetch"),
    },
  });
};

export const useSessionHistory = () => {
  const t = useTranslations("study");

  return useQuery({
    queryKey: studyQueryKeys.sessionHistory(),
    queryFn: studyApi.getSessionHistory,
    meta: {
      errorMessage: t("errors.historyFetch"),
    },
  });
};

export const useStartStudySession = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("study");

  return useMutation({
    mutationFn: (data: StartStudySessionData) =>
      studyApi.startStudySession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studyQueryKeys.currentSession(),
      });
      toast.success(t("messages.sessionStarted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.sessionStart"));
    },
  });
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("study");

  return useMutation({
    mutationFn: (data: SubmitAnswerData) => studyApi.submitAnswer(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: studyQueryKeys.question(variables.sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: studyQueryKeys.currentSession(),
      });
      queryClient.invalidateQueries({ queryKey: studyQueryKeys.progress() });
      if (data.isCorrect) {
        toast.success(t("messages.correctAnswer"));
      } else {
        toast.error(t("messages.incorrectAnswer"));
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.submitAnswer"));
    },
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("study");

  return useMutation({
    mutationFn: (sessionId: string) => studyApi.endSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studyQueryKeys.currentSession(),
      });
      queryClient.invalidateQueries({
        queryKey: studyQueryKeys.sessionHistory(),
      });
      queryClient.invalidateQueries({ queryKey: studyQueryKeys.progress() });
      toast.success(t("messages.sessionCompleted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.sessionEnd"));
    },
  });
};
