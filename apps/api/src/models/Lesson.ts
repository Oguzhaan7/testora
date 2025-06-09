import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  name: string;
  description: string;
  level: "primary" | "highschool" | "university";
  category: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  level: {
    type: String,
    enum: ["primary", "highschool", "university"],
    required: true,
  },
  category: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
