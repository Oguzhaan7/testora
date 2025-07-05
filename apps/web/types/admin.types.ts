export interface CreateLessonData {
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  isActive?: boolean;
}

export interface UpdateLessonData {
  name?: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  isActive?: boolean;
}

export interface CreateTopicData {
  lessonId: string;
  name: string;
  description: string;
  content: string;
  difficulty: number;
  order: number;
  isActive?: boolean;
}

export interface UpdateTopicData {
  name?: string;
  description?: string;
  content?: string;
  difficulty?: number;
  order?: number;
  isActive?: boolean;
}

export interface CreateQuestionData {
  topicId: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  isActive?: boolean;
}

export interface UpdateQuestionData {
  question?: string;
  type?: "multiple_choice" | "true_false" | "fill_blank";
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  order?: number;
  isActive?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalLessons: number;
  totalTopics: number;
  totalQuestions: number;
  totalStudySessions: number;
  activeUsers: number;
}
