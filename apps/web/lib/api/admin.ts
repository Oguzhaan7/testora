import { apiClient } from "./client";
import type { Lesson, Topic } from "@/types/lesson.types";
import type { Question } from "@/types/question.types";
import type {
  CreateLessonData,
  UpdateLessonData,
  CreateTopicData,
  UpdateTopicData,
  CreateQuestionData,
  UpdateQuestionData,
  AdminStats,
} from "@/types/admin.types";

export const adminApi = {
  createLesson: async (data: CreateLessonData): Promise<{ lesson: Lesson }> => {
    return apiClient.post<{ lesson: Lesson }>("/v1/admin/lessons", data);
  },

  updateLesson: async (
    lessonId: string,
    data: UpdateLessonData
  ): Promise<{ lesson: Lesson }> => {
    return apiClient.put<{ lesson: Lesson }>(
      `/v1/admin/lessons/${lessonId}`,
      data
    );
  },

  deleteLesson: async (lessonId: string): Promise<void> => {
    return apiClient.delete<void>(`/v1/admin/lessons/${lessonId}`);
  },

  getAllLessons: async (): Promise<{ lessons: Lesson[] }> => {
    return apiClient.get<{ lessons: Lesson[] }>("/v1/admin/lessons");
  },

  createTopic: async (data: CreateTopicData): Promise<{ topic: Topic }> => {
    return apiClient.post<{ topic: Topic }>("/v1/admin/topics", data);
  },

  updateTopic: async (
    topicId: string,
    data: UpdateTopicData
  ): Promise<{ topic: Topic }> => {
    return apiClient.put<{ topic: Topic }>(`/v1/admin/topics/${topicId}`, data);
  },

  deleteTopic: async (topicId: string): Promise<void> => {
    return apiClient.delete<void>(`/v1/admin/topics/${topicId}`);
  },

  getTopicsByLesson: async (lessonId: string): Promise<{ topics: Topic[] }> => {
    return apiClient.get<{ topics: Topic[] }>(
      `/v1/admin/lessons/${lessonId}/topics`
    );
  },

  createQuestion: async (
    data: CreateQuestionData
  ): Promise<{ question: Question }> => {
    return apiClient.post<{ question: Question }>("/v1/admin/questions", data);
  },

  updateQuestion: async (
    questionId: string,
    data: UpdateQuestionData
  ): Promise<{ question: Question }> => {
    return apiClient.put<{ question: Question }>(
      `/v1/admin/questions/${questionId}`,
      data
    );
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    return apiClient.delete<void>(`/v1/admin/questions/${questionId}`);
  },

  getQuestionsByTopic: async (
    topicId: string
  ): Promise<{ questions: Question[] }> => {
    return apiClient.get<{ questions: Question[] }>(
      `/v1/admin/topics/${topicId}/questions`
    );
  },

  getStats: async (): Promise<{ stats: AdminStats }> => {
    return apiClient.get<{ stats: AdminStats }>("/v1/admin/stats");
  },

  generateQuestions: async (
    topicId: string,
    count: number,
    options?: {
      lessonId?: string;
      difficulty?: string;
      questionType?: string;
      language?: string;
    }
  ): Promise<{ questions: Question[] }> => {
    return apiClient.post<{ questions: Question[] }>(
      "/v1/ai/generate-questions",
      {
        lessonId: options?.lessonId,
        topicId,
        difficulty: options?.difficulty,
        questionType: options?.questionType,
        count,
        language: options?.language,
      }
    );
  },

  generateContent: async (
    topicId: string,
    type: "explanation" | "examples" | "summary"
  ): Promise<{ content: string }> => {
    return apiClient.post<{ content: string }>("/v1/admin/generate-content", {
      topicId,
      type,
    });
  },
};
