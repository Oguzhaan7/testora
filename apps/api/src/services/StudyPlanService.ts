import { StudyPlan, UserProgress, User } from "@/models";
import { IStudyPlan, IPlanItem } from "@/models/StudyPlan";
import { ValidationError, NotFoundError } from "@/types";
import mongoose from "mongoose";

export interface CreateStudyPlanRequest {
  month: string;
  title: string;
  description?: string;
  goals: {
    targetDate: Date;
    examType?: string;
    targetScore?: number;
  };
  planItems: {
    lessonId: string;
    topicId: string;
    targetDate: Date;
    duration: number;
    priority: "low" | "medium" | "high";
  }[];
}

export class StudyPlanService {
  async createStudyPlan(
    userId: string,
    planData: CreateStudyPlanRequest
  ): Promise<IStudyPlan> {
    const existingPlan = await StudyPlan.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month: planData.month,
    });

    if (existingPlan) {
      throw new ValidationError("A study plan already exists for this month");
    }

    const studyPlan = new StudyPlan({
      userId: new mongoose.Types.ObjectId(userId),
      month: planData.month,
      title: planData.title,
      description: planData.description,
      goals: planData.goals,
      planItems: planData.planItems.map((item) => ({
        lessonId: new mongoose.Types.ObjectId(item.lessonId),
        topicId: new mongoose.Types.ObjectId(item.topicId),
        targetDate: item.targetDate,
        duration: item.duration,
        priority: item.priority,
        status: "pending",
      })),
      adaptiveSettings: {
        autoAdjust: true,
        difficultyPreference: "conservative",
      },
      status: "active",
      progress: 0,
    });

    await studyPlan.save();
    return studyPlan;
  }

  async getUserStudyPlans(userId: string) {
    const plans = await StudyPlan.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("planItems.lessonId", "name")
      .populate("planItems.topicId", "name")
      .sort({ createdAt: -1 });

    return plans;
  }

  async getStudyPlan(userId: string, planId: string) {
    const plan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(planId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("planItems.lessonId", "name")
      .populate("planItems.topicId", "name");

    if (!plan) {
      throw new NotFoundError("Study plan not found");
    }

    return plan;
  }

  async updatePlanItemStatus(
    userId: string,
    planId: string,
    itemIndex: number,
    status: "pending" | "completed" | "skipped"
  ) {
    const plan = await StudyPlan.findOne({
      _id: new mongoose.Types.ObjectId(planId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!plan) {
      throw new NotFoundError("Study plan not found");
    }

    if (itemIndex >= plan.planItems.length) {
      throw new ValidationError("Invalid plan item index");
    }

    plan.planItems[itemIndex].status = status;
    if (status === "completed") {
      plan.planItems[itemIndex].completedAt = new Date();
    }

    const completedItems = plan.planItems.filter(
      (item) => item.status === "completed"
    ).length;
    plan.progress = Math.round((completedItems / plan.planItems.length) * 100);

    if (plan.progress === 100) {
      plan.status = "completed";
    }

    await plan.save();
    return plan;
  }

  async generateAIPlan(
    userId: string,
    preferences: {
      examType: string;
      targetDate: Date;
      studyTimePerDay: number;
      currentLevel:
        | "primary"
        | "highschool"
        | "university"
        | "beginner"
        | "intermediate"
        | "advanced";
      weakAreas?: string[];
    }
  ) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const month = preferences.targetDate.toISOString().slice(0, 7);

    const userProgress = await UserProgress.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("lessonId topicId");

    const suggestedPlan = await this.mockAIPlanGeneration(
      preferences,
      userProgress
    );

    return suggestedPlan;
  }

  private async mockAIPlanGeneration(preferences: any, userProgress: any[]) {
    return {
      title: `${preferences.examType} Preparation Plan`,
      description: `${preferences.currentLevel} level ${preferences.examType} preparation plan`,
      estimatedSuccess: 85,
      totalStudyHours: Math.round(
        (((preferences.targetDate.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)) *
          preferences.studyTimePerDay) /
          60
      ),
      recommendations: [
        "Keep your daily study time consistent",
        "Focus more on your weak areas",
        "Review regularly",
      ],
    };
  }
}
