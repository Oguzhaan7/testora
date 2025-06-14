export interface CreateLessonRequest {
  name: string;
  description: string;
  level:
    | "primary"
    | "highschool"
    | "university"
    | "beginner"
    | "intermediate"
    | "advanced";
  category: string;
  tags?: string[];
  estimatedDuration?: number;
  isActive?: boolean;
}

export interface CreateTopicRequest {
  lessonId: string;
  name: string;
  description: string;
  difficulty: number;
  order?: number;
  isActive?: boolean;
}

export interface CreateQuestionRequest {
  lessonId: string;
  topicId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "fill_blank" | "essay";
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  points?: number;
  timeLimit?: number;
  isActive?: boolean;
}

export interface UpdateLessonRequest {
  name?: string;
  description?: string;
  level?:
    | "primary"
    | "highschool"
    | "university"
    | "beginner"
    | "intermediate"
    | "advanced";
  category?: string;
  tags?: string[];
  estimatedDuration?: number;
  isActive?: boolean;
}

export interface UpdateTopicRequest {
  name?: string;
  description?: string;
  difficulty?: number;
  order?: number;
  isActive?: boolean;
}

export interface UpdateQuestionRequest {
  questionText?: string;
  questionType?: "multiple_choice" | "true_false" | "fill_blank" | "essay";
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  points?: number;
  timeLimit?: number;
  isActive?: boolean;
}
