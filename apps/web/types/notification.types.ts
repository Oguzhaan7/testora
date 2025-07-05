export interface Notification {
  id: string;
  userId: string;
  type: "email" | "system" | "achievement" | "reminder";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  studyReminders: boolean;
  achievementAlerts: boolean;
  weeklyProgress: boolean;
}

export interface EmailNotificationRequest {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailNotificationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
}
