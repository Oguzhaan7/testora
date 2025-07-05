import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AnalyticsService } from "@/services/AnalyticsService";
import mongoose from "mongoose";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  const analyticsService = new AnalyticsService();

  fastify.get(
    "/analytics/user",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).id;
        const analytics = await analyticsService.getUserAnalytics(
          new mongoose.Types.ObjectId(userId)
        );

        return reply.code(200).send({
          success: true,
          data: analytics,
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to fetch user analytics",
        });
      }
    }
  );

  fastify.get(
    "/analytics/global",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = request.user as any;

        if (user.role !== "admin") {
          return reply.code(403).send({
            success: false,
            error: "Access denied. Admin role required.",
          });
        }

        const analytics = await analyticsService.getGlobalAnalytics();

        return reply.code(200).send({
          success: true,
          data: analytics,
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to fetch global analytics",
        });
      }
    }
  );

  fastify.post(
    "/analytics/track-usage",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).id;
        const { studyTime, questionsAnswered } = request.body as {
          studyTime: number;
          questionsAnswered: number;
        };

        await analyticsService.trackDailyUsage(
          new mongoose.Types.ObjectId(userId),
          studyTime,
          questionsAnswered
        );

        return reply.code(200).send({
          success: true,
          message: "Usage tracked successfully",
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to track usage",
        });
      }
    }
  );
}
