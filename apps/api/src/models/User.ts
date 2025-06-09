import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  profile: {
    level: "beginner" | "intermediate" | "advanced";
    preferences: {
      studyTimePerDay: number;
      preferredHours: string[];
      reminderSettings: boolean;
      difficulty: "adaptive" | "fixed";
    };
    onboarding: {
      completed: boolean;
      currentStep: number;
    };
    avatar?: string;
    hasSetPassword?: boolean;
    oauthProviders?: {
      google?: {
        providerId: string;
        connectedAt: Date;
      };
      apple?: {
        providerId: string;
        connectedAt: Date;
      };
    };
  };
  currentPlanId?: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  timezone: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profile: {
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
      preferences: {
        studyTimePerDay: {
          type: Number,
          default: 30,
        },
        preferredHours: {
          type: [String],
          default: [],
        },
        reminderSettings: {
          type: Boolean,
          default: true,
        },
        difficulty: {
          type: String,
          enum: ["adaptive", "fixed"],
          default: "adaptive",
        },
      },
      onboarding: {
        completed: {
          type: Boolean,
          default: false,
        },
        currentStep: {
          type: Number,
          default: 0,
        },
      },
      avatar: String,
      hasSetPassword: {
        type: Boolean,
        default: true,
      },
      oauthProviders: {
        google: {
          providerId: String,
          connectedAt: Date,
        },
        apple: {
          providerId: String,
          connectedAt: Date,
        },
      },
    },
    currentPlanId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
