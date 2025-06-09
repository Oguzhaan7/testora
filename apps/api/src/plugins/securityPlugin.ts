import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    security: {
      headers: (additional?: Record<string, string>) => void;
    };
  }
}

async function securityPlugin(fastify: FastifyInstance) {
  const defaultHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
  };

  fastify.addHook("onRequest", async (request, reply) => {
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      reply.header(key, value);
    });

    if (process.env.NODE_ENV === "production") {
      reply.header(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }
  });

  fastify.decorate("security", {
    headers: (additional: Record<string, string> = {}) => {
      return async (request: any, reply: any) => {
        Object.entries(additional).forEach(([key, value]) => {
          reply.header(key, value);
        });
      };
    },
  });
}

export default fp(securityPlugin, {
  name: "security",
});
