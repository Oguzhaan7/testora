import mongoose, { Schema, Document } from "mongoose";

export interface IDailyAnalytics extends Document {
  date: Date;
  activeUsers: number;
  questionsAnswered: number;
  studyTime: number;
  userIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const dailyAnalyticsSchema = new Schema<IDailyAnalytics>({
  date: { type: Date, required: true, unique: true },
  activeUsers: { type: Number, default: 0 },
  questionsAnswered: { type: Number, default: 0 },
  studyTime: { type: Number, default: 0 },
  userIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export const DailyAnalytics = mongoose.model<IDailyAnalytics>(
  "DailyAnalytics",
  dailyAnalyticsSchema
);
