import { FastifyInstance } from "fastify";
import authRoutes from "./auth";
import userRoutes from "./users";
import oauthRoutes from "./oauth";

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(authRoutes, { prefix: "/api/v1/auth" });
  await fastify.register(userRoutes, { prefix: "/api/v1/users" });
  await fastify.register(oauthRoutes, { prefix: "/api/v1/oauth" });
}
