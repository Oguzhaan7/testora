import { UserService } from "./UserService";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "@/config";
import {
  AuthenticationError,
  ValidationError,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  JWTPayload,
} from "@/types";
import crypto from "crypto";
import { EmailService } from "./EmailService";
import { User } from "@/models/User";

export class AuthService {
  private userService: UserService;
  private emailService = new EmailService();

  constructor() {
    this.userService = new UserService();
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const user = await this.userService.createUser(userData);

    await this.sendEmailVerification(user._id.toString());

    const token = this.generateToken(user._id.toString());

    const { password: _, ...userWithoutPassword } = user.toObject();
    return {
      user: userWithoutPassword as any,
      token,
    };
  }

  async sendEmailVerification(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (user.isEmailVerified) {
      throw new ValidationError("Email is already verified");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save();

    await this.emailService.sendEmailVerification(
      user.email,
      verificationToken,
      user.name
    );

    return { message: "Verification email sent successfully" };
  }

  async verifyEmail(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AuthenticationError("Invalid or expired verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    await this.emailService.sendEmailVerificationSuccess(user.email, user.name);

    return { message: "Email verified successfully" };
  }

  async resendEmailVerification(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (user.isEmailVerified) {
      throw new ValidationError("Email is already verified");
    }

    const lastSent = user.emailVerificationExpires;
    if (lastSent && Date.now() - lastSent.getTime() < 60000) {
      throw new ValidationError(
        "Please wait 1 minute before requesting another verification email"
      );
    }

    return await this.sendEmailVerification(user._id.toString());
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new AuthenticationError("Account is deactivated");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError("Invalid email or password");
    }

    await this.userService.updateLastActivity(user._id.toString());

    const token = this.generateToken(user._id.toString());
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword as any,
      token,
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        message:
          "If this email is registered, a password reset link has been sent.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    await this.emailService.sendPasswordResetEmail(
      email,
      resetToken,
      user.name
    );

    return {
      message:
        "If this email is registered, a password reset link has been sent.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AuthenticationError("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.profile.hasSetPassword = true;

    await user.save();

    await this.emailService.sendPasswordResetConfirmation(
      user.email,
      user.name
    );

    return { message: "Password successfully changed" };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (!user.profile.hasSetPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.profile.hasSetPassword = true;
      await user.save();

      return { message: "Password successfully set" };
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new AuthenticationError("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password successfully changed" };
  }

  generateToken(userId: string): string {
    const payload: JWTPayload = { userId };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as SignOptions);
    return token;
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      throw new AuthenticationError("Invalid or expired token");
    }
  }

  async refreshToken(oldToken: string): Promise<{ token: string }> {
    const decoded = this.verifyToken(oldToken);
    const user = await this.userService.getUserById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AuthenticationError("User not found or inactive");
    }

    const newToken = this.generateToken(user._id.toString());
    return { token: newToken };
  }
}
