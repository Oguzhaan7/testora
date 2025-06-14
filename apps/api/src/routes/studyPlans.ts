import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { StudyPlanService } from "@/services/StudyPlanService";
import { CreateStudyPlanRequest, ApiResponse } from "@/types";
import { userBasedLimiter } from "@/middleware/rateLimitMiddleware";

const studyPlanService = new StudyPlanService();

export default async function studyPlanRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateStudyPlanRequest }>(
    "/",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        const planData = request.body as CreateStudyPlanRequest;

        const studyPlan = await studyPlanService.createStudyPlan(
          userId,
          planData
        );

        const response: ApiResponse = {
          success: true,
          data: { studyPlan },
          message: "Study plan created successfully",
        };

        reply.status(201).send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.get(
    "/",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.userId;

        const plans = await studyPlanService.getUserStudyPlans(userId);

        const response: ApiResponse = {
          success: true,
          data: { plans },
          message: "Study plans retrieved successfully",
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

  fastify.get<{ Params: { planId: string } }>(
    "/:planId",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const { planId } = request.params;

        const plan = await studyPlanService.getStudyPlan(userId, planId);

        const response: ApiResponse = {
          success: true,
          data: { plan },
          message: "Study plan retrieved successfully",
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 404).send(response);
      }
    }
  );

  fastify.patch<{
    Params: { planId: string };
    Body: { itemIndex: number; status: "pending" | "completed" | "skipped" };
  }>(
    "/:planId/items/status",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const { planId } = request.params;
        const { itemIndex, status } = request.body;

        const updatedPlan = await studyPlanService.updatePlanItemStatus(
          userId,
          planId,
          itemIndex,
          status
        );

        const response: ApiResponse = {
          success: true,
          data: { plan: updatedPlan },
          message: "Plan item status updated successfully",
        };

        reply.send(response);
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 400).send(response);
      }
    }
  );

  fastify.post<{
    Body: {
      examType: string;
      targetDate: string;
      studyTimePerDay: number;
      currentLevel:
        | "primary"
        | "highschool"
        | "university"
        | "beginner"
        | "intermediate"
        | "advanced";
      weakAreas?: string[];
    };
  }>(
    "/generate-ai-plan",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const preferences = {
          ...request.body,
          targetDate: new Date(request.body.targetDate),
        };

        const aiPlan = await studyPlanService.generateAIPlan(
          userId,
          preferences
        );

        const response: ApiResponse = {
          success: true,
          data: aiPlan,
          message: "AI study plan generated successfully",
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
