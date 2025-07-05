export interface UserAnalytics {
  userId: string;
  totalStudyTime: number;
  sessionsCompleted: number;
  questionsAnswered: number;
  correctAnswers: number;
  averageAccuracy: number;
  streakDays: number;
  lastActivityDate: Date;
  topicProgress: Record<string, number>;
  performanceMetrics: {
    dailyAverage: number;
    weeklyAverage: number;
    monthlyAverage: number;
  };
}

export interface GlobalAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  totalQuestionsAnswered: number;
  averageSessionDuration: number;
  popularTopics: Array<{
    topic: string;
    count: number;
  }>;
  userGrowth: Array<{
    date: string;
    newUsers: number;
    activeUsers: number;
  }>;
}

export interface DailyAnalytics {
  date: string;
  activeUsers: number;
  newUsers: number;
  totalSessions: number;
  totalQuestions: number;
  averageSessionDuration: number;
  topPerformers: Array<{
    userId: string;
    userName: string;
    score: number;
  }>;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
}
