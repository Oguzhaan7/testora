import mongoose, { Schema, Document } from "mongoose";

export interface IUsage extends Document {
  userId: mongoose.Types.ObjectId;
  month: string;
  questionsGenerated: number;
  studyPlansCreated: number;
  aiChatsUsed: number;
  pdfExports: number;
  totalStudyTime: number;
  lastReset: Date;
  createdAt: Date;
}

const usageSchema = new Schema<IUsage>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true },
  questionsGenerated: { type: Number, default: 0 },
  studyPlansCreated: { type: Number, default: 0 },
  aiChatsUsed: { type: Number, default: 0 },
  pdfExports: { type: Number, default: 0 },
  totalStudyTime: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

usageSchema.index({ userId: 1, month: 1 }, { unique: true });

export const Usage = mongoose.model<IUsage>("Usage", usageSchema);
