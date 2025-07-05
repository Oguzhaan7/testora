import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { aiApi } from "@/lib/api/ai";
import type {
  GenerateQuestionsRequest,
  GenerateExplanationRequest,
  ChatRequest,
} from "@/types/ai.types";

export const useGenerateQuestions = () => {
  const t = useTranslations("ai");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateQuestionsRequest) =>
      aiApi.generateQuestions(data),
    onSuccess: () => {
      toast.success(t("messages.questionsGenerated"));
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("errors.questionsGeneration"));
    },
  });
};

export const useGenerateExplanation = () => {
  const t = useTranslations("ai");

  return useMutation({
    mutationFn: (data: GenerateExplanationRequest) =>
      aiApi.generateExplanation(data),
    onError: (error: Error) => {
      toast.error(error.message || t("errors.explanationGeneration"));
    },
  });
};

export const useAIChat = () => {
  const t = useTranslations("ai");

  return useMutation({
    mutationFn: (data: ChatRequest) => aiApi.chat(data),
    onError: (error: Error) => {
      toast.error(error.message || t("errors.chatError"));
    },
  });
};
