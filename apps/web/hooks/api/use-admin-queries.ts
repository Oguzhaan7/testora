import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import type {
  CreateLessonData,
  UpdateLessonData,
  CreateTopicData,
  UpdateTopicData,
  CreateQuestionData,
  UpdateQuestionData,
} from "@/types/admin.types";

export const adminQueryKeys = {
  lessons: () => ["admin", "lessons"] as const,
  topics: (lessonId: string) => ["admin", "topics", lessonId] as const,
  questions: (topicId: string) => ["admin", "questions", topicId] as const,
  stats: () => ["admin", "stats"] as const,
};

export const useAdminLessons = () => {
  const t = useTranslations("admin");

  return useQuery({
    queryKey: adminQueryKeys.lessons(),
    queryFn: adminApi.getAllLessons,
    meta: {
      errorMessage: t("errors.lessonsFetch"),
    },
  });
};

export const useAdminTopics = (lessonId: string) => {
  const t = useTranslations("admin");

  return useQuery({
    queryKey: adminQueryKeys.topics(lessonId),
    queryFn: () => adminApi.getTopicsByLesson(lessonId),
    enabled: !!lessonId,
    meta: {
      errorMessage: t("errors.topicsFetch"),
    },
  });
};

export const useAdminQuestions = (topicId: string) => {
  const t = useTranslations("admin");

  return useQuery({
    queryKey: adminQueryKeys.questions(topicId),
    queryFn: () => adminApi.getQuestionsByTopic(topicId),
    enabled: !!topicId,
    meta: {
      errorMessage: t("errors.questionsFetch"),
    },
  });
};

export const useAdminStats = () => {
  const t = useTranslations("admin");

  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: adminApi.getStats,
    meta: {
      errorMessage: t("errors.statsFetch"),
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: (data: CreateLessonData) => adminApi.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.lessons() });
      toast.success(t("messages.lessonCreated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.lessonCreate"));
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: string;
      data: UpdateLessonData;
    }) => adminApi.updateLesson(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.lessons() });
      toast.success(t("messages.lessonUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.lessonUpdate"));
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: (lessonId: string) => adminApi.deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.lessons() });
      toast.success(t("messages.lessonDeleted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.lessonDelete"));
    },
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: (data: CreateTopicData) => adminApi.createTopic(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.topics(variables.lessonId),
      });
      toast.success(t("messages.topicCreated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.topicCreate"));
    },
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: ({
      topicId,
      data,
    }: {
      topicId: string;
      data: UpdateTopicData;
    }) => adminApi.updateTopic(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "topics"] });
      toast.success(t("messages.topicUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.topicUpdate"));
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: (topicId: string) => adminApi.deleteTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "topics"] });
      toast.success(t("messages.topicDeleted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.topicDelete"));
    },
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: (data: CreateQuestionData) => adminApi.createQuestion(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.questions(variables.topicId),
      });
      toast.success(t("messages.questionCreated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.questionCreate"));
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: UpdateQuestionData;
    }) => adminApi.updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      toast.success(t("messages.questionUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.questionUpdate"));
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: (questionId: string) => adminApi.deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      toast.success(t("messages.questionDeleted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.questionDelete"));
    },
  });
};

export const useGenerateQuestions = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: ({ topicId, count }: { topicId: string; count: number }) =>
      adminApi.generateQuestions(topicId, count),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.questions(variables.topicId),
      });
      toast.success(t("messages.questionsGenerated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.questionsGenerate"));
    },
  });
};

export const useGenerateContent = () => {
  const t = useTranslations("admin");

  return useMutation({
    mutationFn: ({
      topicId,
      type,
    }: {
      topicId: string;
      type: "explanation" | "examples" | "summary";
    }) => adminApi.generateContent(topicId, type),
    onSuccess: () => {
      toast.success(t("messages.contentGenerated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.contentGenerate"));
    },
  });
};
