export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  estimatedDuration?: number; // in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
