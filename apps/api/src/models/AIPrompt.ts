import mongoose, { Schema, Document } from "mongoose";

export interface IAIPrompt extends Document {
  userId: mongoose.Types.ObjectId;
  action:
    | "generateQuestion"
    | "generatePlan"
    | "generateExplanation"
    | "chatResponse";
  prompt: string;
  response?: string;
  modelUsed: "gpt-3.5" | "gpt-4" | "gpt-4-turbo" | "claude-3";
  tokensUsed: number;
  latencyMs: number;
  success: boolean;
  error?: string;
  createdAt: Date;
}

const aiPromptSchema = new Schema<IAIPrompt>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: {
    type: String,
    enum: [
      "generateQuestion",
      "generatePlan",
      "generateExplanation",
      "chatResponse",
    ],
    required: true,
  },
  prompt: { type: String, required: true },
  response: { type: String },
  modelUsed: {
    type: String,
    enum: ["gpt-3.5", "gpt-4", "gpt-4-turbo", "claude-3"],
    required: true,
  },
  tokensUsed: { type: Number, default: 0 },
  latencyMs: { type: Number, default: 0 },
  success: { type: Boolean, default: true },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const AIPrompt = mongoose.model<IAIPrompt>("AIPrompt", aiPromptSchema);
