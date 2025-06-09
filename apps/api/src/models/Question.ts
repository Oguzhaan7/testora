import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  lessonId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  difficulty: "easy" | "medium" | "hard";
  questionType: "multiple_choice" | "true_false" | "fill_blank" | "essay";
  questionText: string;
  options?: string[];
  correctAnswer: string | number;
  hint: string;
  explanation: string;
  tags: string[];
  createdBy: "ai" | "admin";
  aiModel?: string;
  usageCount: number;
  avgSolveTime: number;
  successRate: number;
  isActive: boolean;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  questionType: {
    type: String,
    enum: ["multiple_choice", "true_false", "fill_blank", "essay"],
    required: true,
  },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  hint: { type: String, required: true },
  explanation: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: String, enum: ["ai", "admin"], default: "ai" },
  aiModel: { type: String },
  usageCount: { type: Number, default: 0 },
  avgSolveTime: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Question = mongoose.model<IQuestion>("Question", questionSchema);
