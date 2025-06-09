import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "@/services/AuthService";
import { UserService } from "@/services/UserService";
import { AuthenticationError } from "@/types";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    optionalAuth: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    requireRole: (
      roles: string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    userId: string;
    user: any;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  const authService = new AuthService();
  const userService = new UserService();

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new AuthenticationError("Bearer token required");
        }

        const token = authHeader.substring(7);

        if (!token) {
          throw new AuthenticationError("Access token required");
        }

        console.log("Auth plugin - verifying token...");
        const decoded = authService.verifyToken(token);

        console.log("Auth plugin - decoded:", {
          userId: decoded.userId,
          type: typeof decoded.userId,
          length: decoded.userId?.length,
        });

        // userId'yi string olarak set et
        request.userId = decoded.userId.toString();

        console.log("Auth plugin - userId set to:", request.userId);

        // User bilgisini fetch et
        const user = await userService.getUserById(decoded.userId);
        if (!user || !user.isActive) {
          throw new AuthenticationError("User not found or inactive");
        }
        request.user = user;
      } catch (error: any) {
        console.error("Auth plugin error:", error.message);
        reply.status(401).send({
          success: false,
          error: error.message || "Authentication failed",
        });
        return;
      }
    }
  );

  fastify.decorate(
    "optionalAuth",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const authHeader = request.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          const decoded = authService.verifyToken(token);
          request.userId = decoded.userId.toString();

          const user = await userService.getUserById(decoded.userId);
          if (user && user.isActive) {
            request.user = user;
          }
        }
      } catch (error) {
        // Silent fail for optional auth
      }
    }
  );

  fastify.decorate("requireRole", function (roles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      await fastify.authenticate(request, reply);

      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: "Authentication required",
        });
      }

      if (roles.length > 0 && !roles.includes(request.user.role)) {
        return reply.status(403).send({
          success: false,
          error: "Insufficient permissions",
        });
      }
    };
  });
}

export default fp(authPlugin, {
  name: "auth-plugin",
});
