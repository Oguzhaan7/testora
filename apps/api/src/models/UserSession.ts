import mongoose, { Schema, Document } from "mongoose";

export interface IUserSession extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  sessionType: "practice" | "test" | "review";
  startTime: Date;
  endTime?: Date;
  questionsAttempted: number;
  correctAnswers: number;
  totalTime: number;
  avgTimePerQuestion: number;
  score: number;
  completed: boolean;
  createdAt: Date;
}

const userSessionSchema = new Schema<IUserSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  sessionType: {
    type: String,
    enum: ["practice", "test", "review"],
    default: "practice",
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  questionsAttempted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  avgTimePerQuestion: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const UserSession = mongoose.model<IUserSession>(
  "UserSession",
  userSessionSchema
);
