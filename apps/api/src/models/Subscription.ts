import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: "active" | "cancelled" | "expired" | "trial";
  startedAt: Date;
  expiresAt: Date;
  provider: "stripe" | "manual" | null;
  stripeSubscriptionId?: string;
  autoRenew: boolean;
  cancelledAt?: Date;
  createdAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired", "trial"],
    default: "trial",
  },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  provider: { type: String, enum: ["stripe", "manual", null], default: null },
  stripeSubscriptionId: { type: String },
  autoRenew: { type: Boolean, default: true },
  cancelledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
