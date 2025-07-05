import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { StudyService } from "@/services/StudyService";
import {
  StartStudySessionRequest,
  SubmitAnswerRequest,
  ApiResponse,
} from "@/types";
import { userBasedLimiter } from "@/middleware/rateLimitMiddleware";

const studyService = new StudyService();

export default async function studyRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/lessons",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { level, category } = request.query as {
          level?: string;
          category?: string;
        };

        const lessons = await studyService.getLessons(level, category);

        const response: ApiResponse = {
          success: true,
          data: { lessons },
          message: "Lessons retrieved successfully",
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

  fastify.get<{ Params: { lessonId: string } }>(
    "/lessons/:lessonId/topics",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const { lessonId } = request.params;

        const topics = await studyService.getTopicsByLesson(lessonId);

        const response: ApiResponse = {
          success: true,
          data: { topics },
          message: "Topics retrieved successfully",
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

  fastify.post<{ Body: StartStudySessionRequest }>(
    "/sessions/start",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const sessionData = request.body as StartStudySessionRequest;

        const result = await studyService.startStudySession(
          userId,
          sessionData
        );

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Study session started successfully",
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
    "/sessions/active",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.userId;

        const activeSession = await studyService.getActiveSession(userId);

        const response: ApiResponse = {
          success: true,
          data: { session: activeSession },
          message: activeSession ? "Active session found" : "No active session",
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

  fastify.post<{ Body: SubmitAnswerRequest }>(
    "/sessions/submit-answer",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const answerData = request.body as SubmitAnswerRequest;

        const result = await studyService.submitAnswer(userId, answerData);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Answer submitted successfully",
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

  fastify.post<{ Params: { sessionId: string } }>(
    "/sessions/:sessionId/end",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const { sessionId } = request.params;

        const result = await studyService.endSession(userId, sessionId);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Session ended successfully",
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

  fastify.get<{ Params: { sessionId: string } }>(
    "/sessions/:sessionId/question",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const { sessionId } = request.params;

        const question = await studyService.getSessionQuestion(
          userId,
          sessionId
        );

        const response: ApiResponse = {
          success: true,
          data: { question },
          message: "Question retrieved successfully",
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

  fastify.get(
    "/progress",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const userId = request.userId;
        const { lessonId, topicId } = request.query as {
          lessonId?: string;
          topicId?: string;
        };

        const progress = await studyService.getUserProgress(
          userId,
          lessonId,
          topicId
        );

        const response: ApiResponse = {
          success: true,
          data: { progress },
          message: "User progress retrieved successfully",
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

  fastify.post(
    "/explanation",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).userId;
        const { questionId, userAnswer, language } = request.body as {
          questionId: string;
          userAnswer: string;
          language?: "tr" | "en";
        };

        const explanation = await studyService.getAIExplanation(
          userId,
          questionId,
          userAnswer,
          language
        );

        const response: ApiResponse = {
          success: true,
          data: { explanation },
          message: "AI explanation generated successfully",
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
