import mongoose, { Schema, Document } from "mongoose";

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  mastery: number;
  streakDays: number;
  lastStudied: Date;
  totalTimeSpent: number;
  totalQuestions: number;
  correctAnswers: number;
  weaknesses: string[];
  strengths: string[];
  difficulty: "easy" | "medium" | "hard";
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  mastery: { type: Number, min: 0, max: 100, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastStudied: { type: Date, default: Date.now },
  totalTimeSpent: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  weaknesses: [{ type: String }],
  strengths: [{ type: String }],
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userProgressSchema.index(
  { userId: 1, lessonId: 1, topicId: 1 },
  { unique: true }
);

export const UserProgress = mongoose.model<IUserProgress>(
  "UserProgress",
  userProgressSchema
);
