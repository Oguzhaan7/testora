import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "reminder" | "info" | "promo" | "achievement";
  priority: "low" | "medium" | "high";
  scheduledAt: Date;
  sentAt?: Date;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["reminder", "info", "promo", "achievement"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  scheduledAt: { type: Date, required: true },
  sentAt: { type: Date },
  read: { type: Boolean, default: false },
  actionUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
