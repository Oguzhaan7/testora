import mongoose, { Schema, Document } from "mongoose";

export interface ITopic extends Document {
  lessonId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  difficulty: number;
  prerequisites: string[];
  estimatedTime: number;
  isActive: boolean;
  createdAt: Date;
}

const topicSchema = new Schema<ITopic>({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: Number, min: 1, max: 10, required: true },
  prerequisites: [{ type: String }],
  estimatedTime: { type: Number, default: 45 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Topic = mongoose.model<ITopic>("Topic", topicSchema);
