import { User, IUser } from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { config } from "@/config";
import { ValidationError, NotFoundError } from "@/types";
import { RegisterRequest, UpdateProfileRequest } from "@/types";

export class UserService {
  async createUser(userData: RegisterRequest): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ValidationError("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      config.bcrypt.rounds
    );

    const user = new User({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      profile: {
        level: "beginner",
        preferences: {
          studyTimePerDay: 30,
          preferredHours: [],
          reminderSettings: true,
          difficulty: "adaptive",
        },
        onboarding: {
          completed: false,
          currentStep: 0,
        },
      },
    });

    return await user.save();
  }

  async createOAuthUser(userData: {
    email: string;
    name: string;
    provider: "google" | "apple";
    providerId: string;
    avatar?: string;
  }): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ValidationError("User already exists with this email");
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(
      randomPassword,
      config.bcrypt.rounds
    );

    const user = new User({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      isEmailVerified: true,
      profile: {
        level: "beginner",
        preferences: {
          studyTimePerDay: 30,
          preferredHours: [],
          reminderSettings: true,
          difficulty: "adaptive",
        },
        onboarding: {
          completed: false,
          currentStep: 0,
        },
        avatar: userData.avatar,
        oauthProviders: {
          [userData.provider]: {
            providerId: userData.providerId,
            connectedAt: new Date(),
          },
        },
      },
    });

    return await user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await User.findById(id)
      .select("-password")
      .populate("currentPlanId subscriptionId");
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async updateUser(
    id: string,
    updateData: UpdateProfileRequest
  ): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid user ID");
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...updateData,
        lastActivity: new Date(),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updateLastActivity(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lastActivity: new Date(),
      updatedAt: new Date(),
    });
  }

  async deactivateUser(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await User.findByIdAndUpdate(id, {
      isActive: false,
      updatedAt: new Date(),
    });
    return !!result;
  }

  async verifyEmail(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { isEmailVerified: true, updatedAt: new Date() },
      { new: true }
    ).select("-password");
  }
}
