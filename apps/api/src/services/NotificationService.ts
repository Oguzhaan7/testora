import mongoose from "mongoose";
import { Notification, INotification } from "@/models/Notification";
import { EmailService } from "./EmailService";
import { User } from "@/models/User";

export class NotificationService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async createNotification(notificationData: {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: "reminder" | "info" | "promo" | "achievement";
    priority?: "low" | "medium" | "high";
    scheduledAt: Date;
    actionUrl?: string;
  }): Promise<INotification> {
    const notification = new Notification({
      ...notificationData,
      priority: notificationData.priority || "medium",
    });

    return await notification.save();
  }

  async getUserNotifications(
    userId: mongoose.Types.ObjectId,
    options: {
      limit?: number;
      skip?: number;
      unreadOnly?: boolean;
      type?: "reminder" | "info" | "promo" | "achievement";
    } = {}
  ): Promise<INotification[]> {
    const { limit = 20, skip = 0, unreadOnly = false, type } = options;

    const query: any = { userId };

    if (unreadOnly) {
      query.read = false;
    }

    if (type) {
      query.type = type;
    }

    return await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  async markAsRead(notificationId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    return !!result;
  }

  async markAllAsRead(userId: mongoose.Types.ObjectId): Promise<number> {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    return result.modifiedCount;
  }

  async getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number> {
    return await Notification.countDocuments({ userId, read: false });
  }

  async deleteNotification(
    notificationId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(notificationId);
    return !!result;
  }

  async sendScheduledNotifications(): Promise<void> {
    const now = new Date();
    const notifications = await Notification.find({
      scheduledAt: { $lte: now },
      sentAt: { $exists: false },
    }).populate("userId");

    for (const notification of notifications) {
      try {
        const user = notification.userId as any;
        if (user && user.email) {
          await this.emailService.sendNotification(
            user.email,
            user.name,
            notification.title,
            notification.message,
            notification.actionUrl
          );

          notification.sentAt = new Date();
          await notification.save();
        }
      } catch (error) {
        console.error(
          `Failed to send notification ${notification._id}:`,
          error
        );
      }
    }
  }

  async createStudyReminder(
    userId: mongoose.Types.ObjectId,
    studyPlanId: mongoose.Types.ObjectId,
    reminderTime: Date
  ): Promise<INotification> {
    return await this.createNotification({
      userId,
      title: "Study Time Reminder",
      message: "It's time for your scheduled study session!",
      type: "reminder",
      priority: "high",
      scheduledAt: reminderTime,
      actionUrl: `/study/${studyPlanId}`,
    });
  }

  async createAchievementNotification(
    userId: mongoose.Types.ObjectId,
    achievementTitle: string,
    achievementMessage: string
  ): Promise<INotification> {
    return await this.createNotification({
      userId,
      title: `Achievement Unlocked: ${achievementTitle}`,
      message: achievementMessage,
      type: "achievement",
      priority: "medium",
      scheduledAt: new Date(),
    });
  }

  async createProgressNotification(
    userId: mongoose.Types.ObjectId,
    progressMessage: string
  ): Promise<INotification> {
    return await this.createNotification({
      userId,
      title: "Progress Update",
      message: progressMessage,
      type: "info",
      priority: "low",
      scheduledAt: new Date(),
    });
  }
}
