import { FastifyInstance } from "fastify";
import authRoutes from "./auth";
import userRoutes from "./users";
import oauthRoutes from "./oauth";
import studyRoutes from "./study";
import studyPlanRoutes from "./studyPlans";
import adminRoutes from "./admin";
import aiRoutes from "./ai";
import notificationRoutes from "./notifications";
import analyticsRoutes from "./analytics";

export default async function routes(fastify: FastifyInstance) {
  console.log("Registering routes...");
  await fastify.register(authRoutes, { prefix: "/api/v1/auth" });
  await fastify.register(userRoutes, { prefix: "/api/v1/users" });
  await fastify.register(oauthRoutes, { prefix: "/api/v1/oauth" });
  await fastify.register(studyRoutes, { prefix: "/api/v1/study" });

  await fastify.register(studyPlanRoutes, { prefix: "/api/v1/study-plans" });
  await fastify.register(adminRoutes, { prefix: "/api/v1/admin" });
  await fastify.register(aiRoutes, { prefix: "/api/v1/ai" });
  await fastify.register(notificationRoutes, { prefix: "/api/v1" });
  await fastify.register(analyticsRoutes, { prefix: "/api/v1" });
}
