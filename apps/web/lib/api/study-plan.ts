import { apiClient } from "./client";
import type {
  StudyPlan,
  CreateStudyPlanData,
  UpdateStudyPlanData,
  StudyPlanProgress,
} from "@/types/study-plan.types";

export const studyPlanApi = {
  create: async (
    data: CreateStudyPlanData
  ): Promise<{ studyPlan: StudyPlan }> => {
    return apiClient.post<{ studyPlan: StudyPlan }>("/v1/study-plans", data);
  },

  getAll: async (): Promise<{ studyPlans: StudyPlan[] }> => {
    return apiClient.get<{ studyPlans: StudyPlan[] }>("/v1/study-plans");
  },

  getById: async (planId: string): Promise<{ studyPlan: StudyPlan }> => {
    return apiClient.get<{ studyPlan: StudyPlan }>(`/v1/study-plans/${planId}`);
  },

  update: async (
    planId: string,
    data: UpdateStudyPlanData
  ): Promise<{ studyPlan: StudyPlan }> => {
    return apiClient.put<{ studyPlan: StudyPlan }>(
      `/v1/study-plans/${planId}`,
      data
    );
  },

  delete: async (planId: string): Promise<void> => {
    return apiClient.delete<void>(`/v1/study-plans/${planId}`);
  },
  getProgress: async (
    planId: string
  ): Promise<{ progress: StudyPlanProgress }> => {
    return apiClient.get<{ progress: StudyPlanProgress }>(
      `/v1/study-plans/${planId}/progress`
    );
  },

  generateAI: async (preferences: {
    level: string;
    subjects: string[];
    duration: number;
    goalType: string;
  }): Promise<{ studyPlan: StudyPlan }> => {
    return apiClient.post<{ studyPlan: StudyPlan }>(
      "/v1/study-plans/generate",
      preferences
    );
  },
};
