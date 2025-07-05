import { apiClient } from "./client";
import type {
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  GenerateExplanationRequest,
  GenerateExplanationResponse,
  ChatRequest,
  ChatResponse,
} from "@/types/ai.types";

export const aiApi = {
  generateQuestions: async (
    data: GenerateQuestionsRequest
  ): Promise<GenerateQuestionsResponse> => {
    return apiClient.post<GenerateQuestionsResponse>(
      "/v1/ai/generate-questions",
      data
    );
  },

  generateExplanation: async (
    data: GenerateExplanationRequest
  ): Promise<GenerateExplanationResponse> => {
    return apiClient.post<GenerateExplanationResponse>(
      "/v1/ai/generate-explanation",
      data
    );
  },

  chat: async (data: ChatRequest): Promise<ChatResponse> => {
    return apiClient.post<ChatResponse>("/v1/ai/chat", data);
  },
};
