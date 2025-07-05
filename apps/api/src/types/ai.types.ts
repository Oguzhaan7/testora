export interface GenerateQuestionRequest {
  lessonId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard";
  questionType: "multiple_choice" | "true_false" | "fill_blank" | "essay";
  count?: number;
  language?: "tr" | "en";
}

export interface GenerateStudyPlanRequest {
  userId: string;
  examType: string;
  targetDate: Date;
  studyTimePerDay: number;
  currentLevel: string;
  weakAreas?: string[];
  language?: "tr" | "en";
}

export interface GenerateExplanationRequest {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  language?: "tr" | "en";
}

export interface AIChatRequest {
  userId: string;
  message: string;
  context?: {
    lessonId?: string;
    topicId?: string;
    recentQuestions?: string[];
  };
  language?: "tr" | "en";
}

export interface UserAnalytics {
  totalStudyTime: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  streakDays: number;
  completedTopics: number;
  totalTopics: number;
  progress: number;
  weeklyProgress: {
    date: string;
    studyTime: number;
    questionsAnswered: number;
    accuracy: number;
  }[];
  topicPerformance: {
    topic: string;
    accuracy: number;
    questionsAnswered: number;
    timeSpent: number;
  }[];
  achievements: {
    name: string;
    description: string;
    unlockedAt: Date;
  }[];
}

export interface GlobalAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalStudyPlans: number;
  totalQuestions: number;
  averageAccuracy: number;
  popularTopics: {
    topic: string;
    userCount: number;
    avgAccuracy: number;
  }[];
  usageStats: {
    date: string;
    activeUsers: number;
    questionsAnswered: number;
    studyTime: number;
  }[];
}
