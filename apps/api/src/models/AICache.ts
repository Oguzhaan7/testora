import mongoose, { Schema, Document } from "mongoose";

export interface IAICache extends Document {
  lessonId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  promptHash: string;
  difficulty: "easy" | "medium" | "hard";
  questionSet: mongoose.Types.ObjectId[];
  usageCount: number;
  lastUsed: Date;
  createdAt: Date;
}

const aiCacheSchema = new Schema<IAICache>({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  promptHash: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  questionSet: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  usageCount: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

aiCacheSchema.index(
  { lessonId: 1, topicId: 1, promptHash: 1, difficulty: 1 },
  { unique: true }
);

export const AICache = mongoose.model<IAICache>("AICache", aiCacheSchema);
