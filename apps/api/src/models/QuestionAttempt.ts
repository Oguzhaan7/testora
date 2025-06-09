import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  selectedOption: string | number;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
  attemptedAt: Date;
}

const questionAttemptSchema = new Schema<IQuestionAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: "UserSession" },
  selectedOption: { type: Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
  timeSpent: { type: Number, required: true },
  hintsUsed: { type: Number, default: 0 },
  attemptedAt: { type: Date, default: Date.now },
});

export const QuestionAttempt = mongoose.model<IQuestionAttempt>(
  "QuestionAttempt",
  questionAttemptSchema
);
