import { FastifyRequest, FastifyReply } from "fastify";

interface RateLimitConfig {
  max: number;
  timeWindow: number;
  message?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimitService {
  private store: RateLimitStore = {};

  constructor() {
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, data] of Object.entries(this.store)) {
      if (now > data.resetTime) {
        delete this.store[key];
      }
    }
  }

  private generateKey(
    request: FastifyRequest,
    keyGenerator?: (req: FastifyRequest) => string
  ): string {
    if (keyGenerator) {
      return keyGenerator(request);
    }

    const forwarded = request.headers["x-forwarded-for"];
    const ip = forwarded ? (forwarded as string).split(",")[0] : request.ip;
    const url = request.url || request.routeOptions?.url || "unknown";
    return `${ip}:${url}`;
  }

  createLimiter(
    config: RateLimitConfig,
    keyGenerator?: (req: FastifyRequest) => string
  ) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const key = this.generateKey(request, keyGenerator);
      const now = Date.now();
      const windowStart = now;
      const windowEnd = now + config.timeWindow;

      if (!this.store[key] || now > this.store[key].resetTime) {
        this.store[key] = {
          count: 1,
          resetTime: windowEnd,
        };
      } else {
        this.store[key].count++;
      }

      const current = this.store[key];

      reply.headers({
        "X-RateLimit-Limit": config.max,
        "X-RateLimit-Remaining": Math.max(0, config.max - current.count),
        "X-RateLimit-Reset": Math.ceil(current.resetTime / 1000),
      });

      if (current.count > config.max) {
        const retryAfter = Math.ceil((current.resetTime - now) / 1000);
        reply.headers({ "Retry-After": retryAfter });

        return reply.status(429).send({
          success: false,
          error: config.message || "Too many requests",
          retryAfter,
        });
      }
    };
  }
}

export const rateLimitService = new RateLimitService();
