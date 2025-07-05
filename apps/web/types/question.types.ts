export interface Question {
  _id?: string;
  id: string;
  topicId: string;
  question?: string;
  questionText?: string;
  type?: "multiple_choice" | "true_false" | "fill_blank";
  questionType?: "multiple_choice" | "true_false" | "fill_blank" | "essay";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  order?: number;
  isActive: boolean;
}

export interface StudySession {
  _id?: string;
  id?: string;
  userId: string;
  lessonId?: string;
  topicId: string;
  status: "active" | "completed" | "paused";
  startedAt: string;
  completedAt?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questionsAttempted: number;
}

export interface StudySessionResponse {
  session: StudySession;
  currentQuestion?: Question | null;
  progress: {
    questionsAttempted: number;
    totalQuestions: number;
    correctAnswers: number;
    timeElapsed: number;
  };
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

export interface StudySessionResponse {
  session: StudySession;
  currentQuestion?: Question | null;
  progress: {
    questionsAttempted: number;
    totalQuestions: number;
    correctAnswers: number;
    timeElapsed: number;
  };
}

export interface StartStudySessionData {
  lessonId?: string;
  topicId: string;
  questionCount?: number;
  difficulty?: string;
  sessionType?: string;
}

export interface SubmitAnswerData {
  sessionId: string;
  questionId: string;
  selectedOption: string;
  timeSpent: number;
  hintsUsed?: number;
}
