export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  goalType: "daily" | "weekly" | "monthly";
  targetValue: number;
  currentValue: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudyPlanData {
  title: string;
  description: string;
  goalType: "daily" | "weekly" | "monthly";
  targetValue: number;
  startDate: string;
  endDate: string;
  lessonIds?: string[];
  topicIds?: string[];
}

export interface UpdateStudyPlanData {
  title?: string;
  description?: string;
  targetValue?: number;
  endDate?: string;
  isActive?: boolean;
}

export interface StudyPlanProgress {
  planId: string;
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  currentStreak: number;
  lastActivityDate?: string;
  remainingDays: number;
}
