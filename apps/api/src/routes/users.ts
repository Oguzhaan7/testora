import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "@/services/UserService";
import { UpdateProfileRequest, ApiResponse } from "@/types";

const userService = new UserService();

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/profile",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = request.user;

        const response: ApiResponse = {
          success: true,
          data: { user },
          message: "Profile retrieved successfully",
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

  fastify.put<{ Body: UpdateProfileRequest }>(
    "/profile",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const user = await userService.updateUser(
          userId,
          request.body as UpdateProfileRequest
        );

        const response: ApiResponse = {
          success: true,
          data: { user },
          message: "Profile updated successfully",
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
}
