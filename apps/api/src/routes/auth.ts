import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "@/services/AuthService";
import { RegisterRequest, LoginRequest, ApiResponse } from "@/types";
import {
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  userBasedLimiter,
} from "@/middleware/rateLimitMiddleware";

const authService = new AuthService();

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterRequest }>(
    "/register",
    {
      preHandler: [authLimiter],
    },
    async (request, reply) => {
      try {
        const result = await authService.register(
          request.body as RegisterRequest
        );

        const response: ApiResponse = {
          success: true,
          data: result,
          message:
            "User registered successfully. Please check your email for verification.",
        };

        reply.status(201).send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.post<{ Body: LoginRequest }>(
    "/login",
    {
      preHandler: [authLimiter],
    },
    async (request, reply) => {
      try {
        const result = await authService.login(request.body as LoginRequest);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Login successful",
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 401).send(response);
      }
    }
  );

  fastify.post(
    "/refresh",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const { token } = request.body as { token: string };
        const result = await authService.refreshToken(token);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Token refreshed successfully",
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 401).send(response);
      }
    }
  );

  fastify.get(
    "/me",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      reply.send({
        success: true,
        data: { user: request.user },
        message: "Current user info",
      });
    }
  );

  fastify.post<{ Body: { email: string } }>(
    "/send-verification",
    {
      preHandler: [emailVerificationLimiter, fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const result = await authService.sendEmailVerification(request.userId);

        const response: ApiResponse = {
          success: true,
          message: result.message,
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.post<{ Body: { token: string } }>(
    "/verify-email",
    async (request, reply) => {
      try {
        const { token } = request.body as { token: string };

        if (!token) {
          return reply.status(400).send({
            success: false,
            error: "Verification token is required",
          });
        }

        const result = await authService.verifyEmail(token);

        const response: ApiResponse = {
          success: true,
          message: result.message,
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.post<{ Body: { email: string } }>(
    "/resend-verification",
    {
      preHandler: [emailVerificationLimiter],
    },
    async (request, reply) => {
      try {
        const { email } = request.body as { email: string };

        if (!email) {
          return reply.status(400).send({
            success: false,
            error: "Email address is required",
          });
        }

        const result = await authService.resendEmailVerification(email);

        const response: ApiResponse = {
          success: true,
          message: result.message,
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.post<{ Body: { email: string } }>(
    "/forgot-password",
    {
      preHandler: [passwordResetLimiter],
    },
    async (request, reply) => {
      try {
        const { email } = request.body as { email: string };

        if (!email) {
          return reply.status(400).send({
            success: false,
            error: "Email address is required",
          });
        }

        const result = await authService.forgotPassword(email);

        const response: ApiResponse = {
          success: true,
          message: result.message,
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 500).send(response);
      }
    }
  );

  fastify.post<{ Body: { token: string; password: string } }>(
    "/reset-password",
    async (request, reply) => {
      try {
        const { token, password } = request.body as {
          token: string;
          password: string;
        };

        if (!token || !password) {
          return reply.status(400).send({
            success: false,
            error: "Token and new password are required",
          });
        }

        if (password.length < 6) {
          return reply.status(400).send({
            success: false,
            error: "Password must be at least 6 characters long",
          });
        }

        const result = await authService.resetPassword(token, password);

        const response: ApiResponse = {
          success: true,
          message: result.message,
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.post<{ Body: { currentPassword?: string; newPassword: string } }>(
    "/change-password",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { currentPassword, newPassword } = request.body as {
          currentPassword?: string;
          newPassword: string;
        };

        if (!newPassword) {
          return reply.status(400).send({
            success: false,
            error: "New password is required",
          });
        }

        if (newPassword.length < 6) {
          return reply.status(400).send({
            success: false,
            error: "Password must be at least 6 characters long",
          });
        }

        const result = await authService.changePassword(
          request.userId,
          currentPassword || "",
          newPassword
        );

        const response: ApiResponse = {
          success: true,
          message: result.message,
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );
}
