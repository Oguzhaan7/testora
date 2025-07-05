import mongoose from "mongoose";
import { UserProgress } from "@/models/UserProgress";
import { QuestionAttempt } from "@/models/QuestionAttempt";
import { StudyPlan } from "@/models/StudyPlan";
import { User } from "@/models/User";
import { DailyAnalytics } from "@/models/DailyAnalytics";
import { UserAnalytics, GlobalAnalytics } from "@/types";

export class AnalyticsService {
  async getUserAnalytics(
    userId: mongoose.Types.ObjectId
  ): Promise<UserAnalytics> {
    const [userProgress, questionAttempts, studyPlans, user] =
      await Promise.all([
        UserProgress.find({ userId }).populate("topicId"),
        QuestionAttempt.find({ userId }).populate("questionId"),
        StudyPlan.find({ userId }),
        User.findById(userId),
      ]);

    const totalQuestions = questionAttempts.length;
    const correctAnswers = questionAttempts.filter(
      (attempt) => attempt.isCorrect
    ).length;
    const accuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const totalStudyTime = userProgress.reduce(
      (sum, progress) => sum + progress.totalTimeSpent,
      0
    );
    const completedTopics = userProgress.filter(
      (progress) => progress.mastery >= 80
    ).length;
    const totalTopics = userProgress.length;
    const progress =
      totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    const streakDays = await this.calculateStreakDays(userId);
    const weeklyProgress = await this.getWeeklyProgress(userId);
    const topicPerformance = await this.getTopicPerformance(userId);
    const achievements = await this.getUserAchievements(userId);

    return {
      totalStudyTime,
      totalQuestions,
      correctAnswers,
      accuracy,
      streakDays,
      completedTopics,
      totalTopics,
      progress,
      weeklyProgress,
      topicPerformance,
      achievements,
    };
  }

  private async calculateStreakDays(
    userId: mongoose.Types.ObjectId
  ): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttempts = await QuestionAttempt.find({
      userId,
      attemptedAt: { $gte: sevenDaysAgo },
    }).sort({ attemptedAt: -1 });

    if (recentAttempts.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasActivityOnDay = recentAttempts.some(
        (attempt) =>
          attempt.attemptedAt >= dayStart && attempt.attemptedAt <= dayEnd
      );

      if (hasActivityOnDay) {
        streak++;
      } else if (streak > 0) {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  private async getWeeklyProgress(userId: mongoose.Types.ObjectId) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const attempts = await QuestionAttempt.find({
      userId,
      attemptedAt: { $gte: sevenDaysAgo },
    });

    const progress = await UserProgress.find({
      userId,
      updatedAt: { $gte: sevenDaysAgo },
    });

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAttempts = attempts.filter(
        (attempt) =>
          attempt.attemptedAt >= dayStart && attempt.attemptedAt <= dayEnd
      );

      const dayProgress = progress.filter(
        (p) => p.updatedAt >= dayStart && p.updatedAt <= dayEnd
      );

      const studyTime = dayProgress.reduce(
        (sum, p) => sum + p.totalTimeSpent,
        0
      );
      const questionsAnswered = dayAttempts.length;
      const correctAnswers = dayAttempts.filter((a) => a.isCorrect).length;
      const accuracy =
        questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

      weeklyData.push({
        date: date.toISOString().split("T")[0],
        studyTime,
        questionsAnswered,
        accuracy,
      });
    }

    return weeklyData;
  }

  private async getTopicPerformance(userId: mongoose.Types.ObjectId) {
    const userProgress = await UserProgress.find({ userId }).populate(
      "topicId"
    );
    const questionAttempts = await QuestionAttempt.find({ userId }).populate({
      path: "questionId",
      populate: {
        path: "topicId",
        model: "Topic",
      },
    });

    const topicMap = new Map();

    userProgress.forEach((progress) => {
      const topic = progress.topicId as any;
      if (topic) {
        topicMap.set(topic._id.toString(), {
          topic: topic.title,
          timeSpent: progress.totalTimeSpent,
          questionsAnswered: 0,
          correctAnswers: 0,
        });
      }
    });

    questionAttempts.forEach((attempt) => {
      const question = attempt.questionId as any;
      if (question && question.topicId) {
        const topicId = question.topicId._id.toString();
        if (topicMap.has(topicId)) {
          const topicData = topicMap.get(topicId);
          topicData.questionsAnswered++;
          if (attempt.isCorrect) {
            topicData.correctAnswers++;
          }
        }
      }
    });

    return Array.from(topicMap.values()).map((topic) => ({
      topic: topic.topic,
      accuracy:
        topic.questionsAnswered > 0
          ? (topic.correctAnswers / topic.questionsAnswered) * 100
          : 0,
      questionsAnswered: topic.questionsAnswered,
      timeSpent: topic.timeSpent,
    }));
  }

  private async getUserAchievements(userId: mongoose.Types.ObjectId) {
    const achievements = [];

    const totalQuestions = await QuestionAttempt.countDocuments({ userId });
    const correctAnswers = await QuestionAttempt.countDocuments({
      userId,
      isCorrect: true,
    });
    const completedTopics = await UserProgress.countDocuments({
      userId,
      isCompleted: true,
    });
    const streakDays = await this.calculateStreakDays(userId);

    if (totalQuestions >= 10) {
      achievements.push({
        name: "First Steps",
        description: "Answered 10 questions",
        unlockedAt: new Date(),
      });
    }

    if (totalQuestions >= 100) {
      achievements.push({
        name: "Century",
        description: "Answered 100 questions",
        unlockedAt: new Date(),
      });
    }

    if (correctAnswers >= 50) {
      achievements.push({
        name: "Accuracy Master",
        description: "Got 50 questions correct",
        unlockedAt: new Date(),
      });
    }

    if (completedTopics >= 5) {
      achievements.push({
        name: "Topic Explorer",
        description: "Completed 5 topics",
        unlockedAt: new Date(),
      });
    }

    if (streakDays >= 7) {
      achievements.push({
        name: "Week Warrior",
        description: "7-day study streak",
        unlockedAt: new Date(),
      });
    }

    return achievements;
  }

  async getGlobalAnalytics(): Promise<GlobalAnalytics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      totalStudyPlans,
      totalQuestions,
      recentAttempts,
      usageData,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } }),
      StudyPlan.countDocuments(),
      QuestionAttempt.countDocuments(),
      QuestionAttempt.find({ attemptedAt: { $gte: thirtyDaysAgo } }).populate({
        path: "questionId",
        populate: {
          path: "topicId",
          model: "Topic",
        },
      }),
      DailyAnalytics.find({ date: { $gte: thirtyDaysAgo } }).sort({ date: -1 }),
    ]);

    const correctAttempts = recentAttempts.filter(
      (attempt: any) => attempt.isCorrect
    ).length;
    const averageAccuracy =
      recentAttempts.length > 0
        ? (correctAttempts / recentAttempts.length) * 100
        : 0;

    const topicMap = new Map();
    recentAttempts.forEach((attempt: any) => {
      const question = attempt.questionId as any;
      if (question && question.topicId) {
        const topicTitle = question.topicId.title;
        if (!topicMap.has(topicTitle)) {
          topicMap.set(topicTitle, { userCount: new Set(), attempts: [] });
        }
        topicMap.get(topicTitle).userCount.add(attempt.userId.toString());
        topicMap.get(topicTitle).attempts.push(attempt);
      }
    });

    const popularTopics = Array.from(topicMap.entries())
      .map(([topic, data]) => {
        const correctCount = data.attempts.filter(
          (a: any) => a.isCorrect
        ).length;
        return {
          topic,
          userCount: data.userCount.size,
          avgAccuracy:
            data.attempts.length > 0
              ? (correctCount / data.attempts.length) * 100
              : 0,
        };
      })
      .sort((a, b) => b.userCount - a.userCount)
      .slice(0, 10);

    const usageStats = usageData.map((usage: any) => ({
      date: usage.date.toISOString().split("T")[0],
      activeUsers: usage.activeUsers,
      questionsAnswered: usage.questionsAnswered,
      studyTime: usage.studyTime,
    }));

    return {
      totalUsers,
      activeUsers,
      totalStudyPlans,
      totalQuestions,
      averageAccuracy,
      popularTopics,
      usageStats,
    };
  }

  async trackDailyUsage(
    userId: mongoose.Types.ObjectId,
    studyTime: number,
    questionsAnswered: number
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let usage = await DailyAnalytics.findOne({ date: today });
    if (!usage) {
      usage = new DailyAnalytics({
        date: today,
        activeUsers: 0,
        questionsAnswered: 0,
        studyTime: 0,
        userIds: [],
      });
    }

    if (!usage.userIds.includes(userId)) {
      usage.userIds.push(userId);
      usage.activeUsers = usage.userIds.length;
    }

    usage.questionsAnswered += questionsAnswered;
    usage.studyTime += studyTime;

    await usage.save();
  }
}
