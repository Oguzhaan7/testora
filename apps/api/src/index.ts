import "module-alias/register";

import fastify from "fastify";
import { connectDatabase, config } from "@/config";
import routes from "@/routes";
import authPlugin from "@/plugins/auth";
import securityPlugin from "@/plugins/securityPlugin";
import corsPlugin from "@/plugins/corsPlugin";
import { generalLimiter } from "@/middleware/rateLimitMiddleware";
import "@/models";

const app = fastify({
  logger: {
    level: config.nodeEnv === "production" ? "info" : "debug",
  },
});

app.register(async function (fastify) {
  fastify.addHook("onReady", async () => {
    console.log("🚀 Fastify server is ready");
  });

  fastify.addHook("onClose", async () => {
    console.log("📴 Fastify server is closing");
  });
});

const start = async () => {
  try {
    await app.register(corsPlugin);
    await app.register(securityPlugin);
    await app.register(authPlugin);

    app.addHook("preHandler", generalLimiter);

    app.get("/", async (request, reply) => {
      return {
        success: true,
        message: "Testora API is running",
        version: "1.0.0",
        environment: config.nodeEnv,
      };
    });

    app.get("/health", async (request, reply) => {
      return {
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
      };
    });

    await app.register(routes);
    await connectDatabase();

    await app.listen({
      port: config.port,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server is running on port ${config.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
