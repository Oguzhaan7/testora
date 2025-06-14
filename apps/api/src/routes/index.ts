import { FastifyInstance } from "fastify";
import authRoutes from "./auth";
import userRoutes from "./users";
import oauthRoutes from "./oauth";
import studyRoutes from "./study";
import studyPlanRoutes from "./studyPlans";
import adminRoutes from "./admin";

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(authRoutes, { prefix: "/api/v1/auth" });
  await fastify.register(userRoutes, { prefix: "/api/v1/users" });
  await fastify.register(oauthRoutes, { prefix: "/api/v1/oauth" });
  await fastify.register(studyRoutes, { prefix: "/api/v1/study" });
  await fastify.register(studyPlanRoutes, { prefix: "/api/v1/study-plans" });
  await fastify.register(adminRoutes, { prefix: "/api/v1/admin" });
}
