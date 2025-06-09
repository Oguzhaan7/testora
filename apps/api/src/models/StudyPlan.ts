import mongoose, { Schema, Document } from "mongoose";

export interface IPlanItem {
  lessonId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  targetDate: Date;
  duration: number;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "skipped";
  completedAt?: Date;
}

export interface IStudyPlan extends Document {
  userId: mongoose.Types.ObjectId;
  month: string;
  title: string;
  description?: string;
  goals: {
    targetDate: Date;
    examType?: string;
    targetScore?: number;
  };
  planItems: IPlanItem[];
  adaptiveSettings: {
    autoAdjust: boolean;
    difficultyPreference: "conservative" | "challenging";
  };
  status: "active" | "paused" | "completed";
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const planItemSchema = new Schema<IPlanItem>({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  targetDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "skipped"],
    default: "pending",
  },
  completedAt: { type: Date },
});

const studyPlanSchema = new Schema<IStudyPlan>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  goals: {
    targetDate: { type: Date, required: true },
    examType: { type: String },
    targetScore: { type: Number },
  },
  planItems: [planItemSchema],
  adaptiveSettings: {
    autoAdjust: { type: Boolean, default: true },
    difficultyPreference: {
      type: String,
      enum: ["conservative", "challenging"],
      default: "conservative",
    },
  },
  status: {
    type: String,
    enum: ["active", "paused", "completed"],
    default: "active",
  },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const StudyPlan = mongoose.model<IStudyPlan>(
  "StudyPlan",
  studyPlanSchema
);
