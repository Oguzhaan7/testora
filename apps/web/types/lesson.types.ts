export interface Lesson {
  _id: string;
  id?: string;
  name: string;
  title?: string;
  description: string;
  level: string;
  category: string;
  estimatedDuration?: number; // in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Topic {
  _id: string;
  id?: string;
  lessonId: string;
  name: string;
  title?: string;
  description: string;
  content?: string;
  difficulty: number;
  prerequisites: string[];
  estimatedTime: number;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
