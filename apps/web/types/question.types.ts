export interface Question {
  id: string;
  topicId: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  isActive: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  topicId: string;
  status: "active" | "completed" | "paused";
  startedAt: string;
  completedAt?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface SessionSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
}

export interface UserProgress {
  userId: string;
  totalLessonsCompleted: number;
  totalTopicsCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
}

export interface StartStudySessionData {
  topicId: string;
  questionCount?: number;
  difficulty?: string;
}

export interface SubmitAnswerData {
  sessionId: string;
  questionId: string;
  userAnswer: string;
  timeSpent: number;
}
