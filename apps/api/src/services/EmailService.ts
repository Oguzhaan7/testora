import nodemailer from "nodemailer";
import { config } from "@/config";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });
  }

  async sendEmailVerification(
    email: string,
    verificationToken: string,
    name: string
  ) {
    const verificationUrl = `${config.frontend.url}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"Testora" <${config.email.from}>`,
      to: email,
      subject: "Email Verification - Testora",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Welcome to Testora, ${name}!</h2>
          <p>Thank you for registering with Testora. Please verify your email address to complete your registration.</p>
          <p>Click the button below to verify your email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #666;">This link is valid for 24 hours.</p>
          <p style="color: #666;">If you didn't create this account, you can safely ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Testora Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email verification sent to ${email}`);
    } catch (error) {
      console.error("Email verification sending failed:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendEmailVerificationSuccess(email: string, name: string) {
    const mailOptions = {
      from: `"Testora" <${config.email.from}>`,
      to: email,
      subject: "Email Verified Successfully - Testora",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Email Verified, ${name}!</h2>
          <p>Your email address has been successfully verified.</p>
          <p>You can now fully access all Testora features.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontend.url}/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <hr style="margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Testora Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email verification success sent to ${email}`);
    } catch (error) {
      console.error("Email verification success sending failed:", error);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    name: string
  ) {
    const resetUrl = `${config.frontend.url}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Testora" <${config.email.from}>`,
      to: email,
      subject: "Password Reset - Testora",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p>You have requested a password reset for your Testora account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666;">This link is valid for 1 hour.</p>
          <p style="color: #666;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Testora Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendPasswordResetConfirmation(email: string, name: string) {
    const mailOptions = {
      from: `"Testora" <${config.email.from}>`,
      to: email,
      subject: "Password Successfully Changed - Testora",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p>Your Testora account password has been successfully changed.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Testora Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password change confirmation sent to ${email}`);
    } catch (error) {
      console.error("Confirmation email sending failed:", error);
    }
  }

  async sendNotification(
    email: string,
    name: string,
    title: string,
    message: string,
    actionUrl?: string
  ) {
    const mailOptions = {
      from: `"Testora" <${config.email.from}>`,
      to: email,
      subject: `${title} - Testora`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <h3 style="color: #007bff;">${title}</h3>
          <p>${message}</p>
          ${
            actionUrl
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontend.url}${actionUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Details
            </a>
          </div>
          `
              : ""
          }
          <hr style="margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Testora Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Notification sent to ${email}`);
    } catch (error) {
      console.error("Notification email sending failed:", error);
      throw new Error("Failed to send notification email");
    }
  }
}
