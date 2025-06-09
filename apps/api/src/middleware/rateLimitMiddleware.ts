import { FastifyRequest } from "fastify";
import { rateLimitService } from "@/services/RateLimitService";

export const authLimiter = rateLimitService.createLimiter({
  max: 5,
  timeWindow: 15 * 60 * 1000,
  message: "Too many authentication attempts, please try again later",
});

export const generalLimiter = rateLimitService.createLimiter({
  max: 100,
  timeWindow: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later",
});

export const passwordResetLimiter = rateLimitService.createLimiter({
  max: 3,
  timeWindow: 60 * 60 * 1000,
  message: "Too many password reset attempts, please try again later",
});

export const emailVerificationLimiter = rateLimitService.createLimiter({
  max: 5,
  timeWindow: 60 * 60 * 1000,
  message: "Too many email verification attempts, please try again later",
});

export const userBasedLimiter = rateLimitService.createLimiter(
  {
    max: 10,
    timeWindow: 15 * 60 * 1000,
    message: "Too many requests from this user, please try again later",
  },
  (req: FastifyRequest) => {
    const userId = (req as any).userId;
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  }
);
