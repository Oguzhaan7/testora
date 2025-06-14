import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { studyPlanApi } from "@/lib/api/study-plan";
import type {
  CreateStudyPlanData,
  UpdateStudyPlanData,
} from "@/types/study-plan.types";

export const studyPlanQueryKeys = {
  all: () => ["studyPlans"] as const,
  byId: (planId: string) => ["studyPlans", planId] as const,
  progress: (planId: string) => ["studyPlans", planId, "progress"] as const,
};

export const useStudyPlans = () => {
  const t = useTranslations("studyPlan");

  return useQuery({
    queryKey: studyPlanQueryKeys.all(),
    queryFn: studyPlanApi.getAll,
    meta: {
      errorMessage: t("errors.plansFetch"),
    },
  });
};

export const useStudyPlan = (planId: string) => {
  const t = useTranslations("studyPlan");

  return useQuery({
    queryKey: studyPlanQueryKeys.byId(planId),
    queryFn: () => studyPlanApi.getById(planId),
    enabled: !!planId,
    meta: {
      errorMessage: t("errors.planFetch"),
    },
  });
};

export const useStudyPlanProgress = (planId: string) => {
  const t = useTranslations("studyPlan");

  return useQuery({
    queryKey: studyPlanQueryKeys.progress(planId),
    queryFn: () => studyPlanApi.getProgress(planId),
    enabled: !!planId,
    meta: {
      errorMessage: t("errors.progressFetch"),
    },
  });
};

export const useCreateStudyPlan = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("studyPlan");

  return useMutation({
    mutationFn: (data: CreateStudyPlanData) => studyPlanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyPlanQueryKeys.all() });
      toast.success(t("messages.planCreated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.planCreate"));
    },
  });
};

export const useUpdateStudyPlan = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("studyPlan");

  return useMutation({
    mutationFn: ({
      planId,
      data,
    }: {
      planId: string;
      data: UpdateStudyPlanData;
    }) => studyPlanApi.update(planId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: studyPlanQueryKeys.all() });
      queryClient.invalidateQueries({
        queryKey: studyPlanQueryKeys.byId(variables.planId),
      });
      toast.success(t("messages.planUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.planUpdate"));
    },
  });
};

export const useDeleteStudyPlan = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("studyPlan");

  return useMutation({
    mutationFn: (planId: string) => studyPlanApi.delete(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyPlanQueryKeys.all() });
      toast.success(t("messages.planDeleted"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.planDelete"));
    },
  });
};

export const useGenerateAIPlan = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("studyPlan");

  return useMutation({
    mutationFn: (preferences: {
      level: string;
      subjects: string[];
      duration: number;
      goalType: string;
    }) => studyPlanApi.generateAI(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyPlanQueryKeys.all() });
      toast.success(t("messages.aiPlanGenerated"));
    },
    onError: (error: Error) => {
      toast.error(error?.message || t("errors.aiPlanGenerate"));
    },
  });
};
