import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AdminService } from "@/services/AdminService";
import {
  CreateLessonRequest,
  CreateTopicRequest,
  CreateQuestionRequest,
  UpdateLessonRequest,
  UpdateTopicRequest,
  UpdateQuestionRequest,
} from "@/types/admin";
import { ApiResponse } from "@/types";
import { userBasedLimiter } from "@/middleware/rateLimitMiddleware";

const adminService = new AdminService();

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateLessonRequest }>(
    "/lessons",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        const lessonData = request.body as CreateLessonRequest;

        const result = await adminService.createLesson(userId, lessonData);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Lesson created successfully",
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

  fastify.put<{ Params: { lessonId: string }; Body: UpdateLessonRequest }>(
    "/lessons/:lessonId",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { lessonId } = request.params;
        const updateData = request.body as UpdateLessonRequest;

        const result = await adminService.updateLesson(lessonId, updateData);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Lesson updated successfully",
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

  fastify.delete<{ Params: { lessonId: string } }>(
    "/lessons/:lessonId",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { lessonId } = request.params;

        const result = await adminService.deleteLesson(lessonId);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Lesson deleted successfully",
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

  fastify.get(
    "/lessons",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await adminService.getAllLessons();

        const response: ApiResponse = {
          success: true,
          data: result,
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

  fastify.post<{ Body: CreateTopicRequest }>(
    "/topics",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const topicData = request.body as CreateTopicRequest;

        const result = await adminService.createTopic(topicData);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Topic created successfully",
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

  fastify.put<{ Params: { topicId: string }; Body: UpdateTopicRequest }>(
    "/topics/:topicId",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { topicId } = request.params;
        const updateData = request.body as UpdateTopicRequest;

        const result = await adminService.updateTopic(topicId, updateData);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Topic updated successfully",
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

  fastify.delete<{ Params: { topicId: string } }>(
    "/topics/:topicId",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { topicId } = request.params;

        const result = await adminService.deleteTopic(topicId);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Topic deleted successfully",
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

  fastify.get<{ Params: { lessonId: string } }>(
    "/lessons/:lessonId/topics",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const { lessonId } = request.params;

        const result = await adminService.getTopicsByLesson(lessonId);

        const response: ApiResponse = {
          success: true,
          data: result,
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

  fastify.post<{ Body: CreateQuestionRequest }>(
    "/questions",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const questionData = request.body as CreateQuestionRequest;

        const result = await adminService.createQuestion(questionData);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Question created successfully",
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

  fastify.put<{ Params: { questionId: string }; Body: UpdateQuestionRequest }>(
    "/questions/:questionId",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { questionId } = request.params;
        const updateData = request.body as UpdateQuestionRequest;

        const result = await adminService.updateQuestion(
          questionId,
          updateData
        );

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Question updated successfully",
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

  fastify.delete<{ Params: { questionId: string } }>(
    "/questions/:questionId",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request, reply) => {
      try {
        const { questionId } = request.params;

        const result = await adminService.deleteQuestion(questionId);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Question deleted successfully",
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

  fastify.get<{ Params: { topicId: string } }>(
    "/topics/:topicId/questions",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const { topicId } = request.params;

        const result = await adminService.getQuestionsByTopic(topicId);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Questions retrieved successfully",
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
    "/lessons/:lessonId/questions",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        const { lessonId } = request.params;

        const result = await adminService.getQuestionsByLesson(lessonId);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: "Questions retrieved successfully",
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

  fastify.post<{ Body: { questions: CreateQuestionRequest[] } }>(
    "/questions/bulk",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { questions } = request.body as {
          questions: CreateQuestionRequest[];
        };

        const result = await adminService.bulkCreateQuestions(questions);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: `${result.count} questions created successfully`,
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

  fastify.post<{ Body: { topicId: string; count: number } }>(
    "/generate-questions",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { topicId, count } = request.body as {
          topicId: string;
          count: number;
        };

        const result = await adminService.generateQuestions(topicId, count);

        const response: ApiResponse = {
          success: true,
          data: result,
          message: `${result.questions.length} questions generated successfully`,
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
}
