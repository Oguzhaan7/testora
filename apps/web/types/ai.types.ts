export interface GenerateQuestionsRequest {
  lessonId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard";
  questionType: "multiple_choice" | "true_false" | "short_answer";
  count: number;
  language: "en" | "tr";
}

export interface GenerateQuestionsResponse {
  questions: Array<{
    questionText: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    questionType: "multiple_choice" | "true_false" | "short_answer";
  }>;
}

export interface GenerateExplanationRequest {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  language: "en" | "tr";
}

export interface GenerateExplanationResponse {
  explanation: string;
  tips: string[];
  relatedTopics: string[];
}

export interface ChatRequest {
  message: string;
  context?: {
    lessonId?: string;
    topicId?: string;
    recentQuestions?: string[];
  };
  language: "en" | "tr";
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
  context: {
    lessonId?: string;
    topicId?: string;
  };
}
