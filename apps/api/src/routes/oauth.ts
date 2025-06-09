import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { OAuthService } from "@/services/OAuthService";
import { ApiResponse } from "@/types";

const oauthService = new OAuthService();

export default async function oauthRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: { idToken: string } }>(
    "/google",
    async (request, reply) => {
      try {
        const { idToken } = request.body as { idToken: string };

        if (!idToken) {
          return reply.status(400).send({
            success: false,
            error: "Google ID token is required",
          });
        }

        const result = await oauthService.googleSignIn(idToken);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: result.isNewUser
            ? "Account created successfully"
            : "Login successful",
        };

        reply.status(result.isNewUser ? 201 : 200).send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 401).send(response);
      }
    }
  );

  // Apple'ı şimdilik comment out edelim
  /*
  fastify.post<{ Body: { identityToken: string; user?: any } }>(
    "/apple",
    async (request, reply) => {
      // Apple implementation
    }
  );
  */

  fastify.get("/google/config", async (request, reply) => {
    reply.send({
      success: true,
      data: {
        clientId: process.env.GOOGLE_CLIENT_ID,
      },
    });
  });

  // Test endpoint - development only
  fastify.get("/test-google", async (request, reply) => {
    if (process.env.NODE_ENV !== "development") {
      return reply.status(404).send({ error: "Not found" });
    }

    reply.send({
      success: true,
      message: "Use Google OAuth Playground to get access token",
      instructions: [
        "1. Go to https://developers.google.com/oauthplayground/",
        "2. Select 'Google OAuth2 API v2' scopes",
        "3. Authorize and get access token",
        "4. Use the token in POST /api/v1/oauth/google",
      ],
      clientId: process.env.GOOGLE_CLIENT_ID,
    });
  });
}
