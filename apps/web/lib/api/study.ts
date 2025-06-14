import { apiClient } from "./client";
import type { Lesson, Topic } from "@/types/lesson.types";
import type {
  Question,
  StudySession,
  SessionSummary,
  UserProgress,
  StartStudySessionData,
  SubmitAnswerData,
} from "@/types/question.types";

export const studyApi = {
  getLessons: async (
    level?: string,
    category?: string
  ): Promise<{ lessons: Lesson[] }> => {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    if (category) params.append("category", category);

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<{ lessons: Lesson[] }>(`/v1/study/lessons${query}`);
  },

  getTopicsByLesson: async (lessonId: string): Promise<{ topics: Topic[] }> => {
    return apiClient.get<{ topics: Topic[] }>(
      `/v1/study/lessons/${lessonId}/topics`
    );
  },

  startStudySession: async (
    data: StartStudySessionData
  ): Promise<StudySession> => {
    return apiClient.post<StudySession>("/v1/study/sessions/start", data);
  },

  getCurrentSession: async (): Promise<{ session: StudySession | null }> => {
    return apiClient.get<{ session: StudySession | null }>(
      "/v1/study/sessions/current"
    );
  },

  getSessionQuestion: async (
    sessionId: string
  ): Promise<{ question: Question }> => {
    return apiClient.get<{ question: Question }>(
      `/v1/study/sessions/${sessionId}/question`
    );
  },

  submitAnswer: async (
    data: SubmitAnswerData
  ): Promise<{ isCorrect: boolean; explanation: string }> => {
    return apiClient.post<{ isCorrect: boolean; explanation: string }>(
      "/v1/study/answer",
      data
    );
  },
  endSession: async (
    sessionId: string
  ): Promise<{ session: StudySession; summary: SessionSummary }> => {
    return apiClient.post<{ session: StudySession; summary: SessionSummary }>(
      `/v1/study/sessions/${sessionId}/end`
    );
  },

  getProgress: async (): Promise<{ progress: UserProgress }> => {
    return apiClient.get<{ progress: UserProgress }>("/v1/study/progress");
  },

  getSessionHistory: async (): Promise<{ sessions: StudySession[] }> => {
    return apiClient.get<{ sessions: StudySession[] }>(
      "/v1/study/sessions/history"
    );
  },
};
