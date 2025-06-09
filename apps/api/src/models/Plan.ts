import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: "Free" | "Premium" | "Pro";
  priceMonthly: number;
  priceYearly: number;
  limits: {
    dailyQuestions: number;
    monthlyPlans: number;
    aiChat: boolean;
    exportPdf: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  };
  features: string[];
  isActive: boolean;
  createdAt: Date;
}

const planSchema = new Schema<IPlan>({
  name: {
    type: String,
    enum: ["Free", "Premium", "Pro"],
    required: true,
    unique: true,
  },
  priceMonthly: { type: Number, required: true },
  priceYearly: { type: Number, required: true },
  limits: {
    dailyQuestions: { type: Number, required: true },
    monthlyPlans: { type: Number, required: true },
    aiChat: { type: Boolean, default: false },
    exportPdf: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
  },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Plan = mongoose.model<IPlan>("Plan", planSchema);
