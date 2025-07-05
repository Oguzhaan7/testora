import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { aiService } from "@/services/AIService";
import { ApiResponse } from "@/types";
import { userBasedLimiter } from "@/middleware/rateLimitMiddleware";

export default async function aiRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      lessonId: string;
      topicId: string;
      difficulty: "easy" | "medium" | "hard";
      questionType: "multiple_choice" | "true_false" | "fill_blank";
      count?: number;
      language?: "tr" | "en";
    };
  }>(
    "/generate-questions",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const {
          lessonId,
          topicId,
          difficulty,
          questionType,
          count = 5,
          language = "tr",
        } = request.body as any;

        const questions = await aiService.generateQuestions({
          lessonId,
          topicId,
          difficulty,
          questionType,
          count,
          language,
        });

        const response: ApiResponse = {
          success: true,
          data: { questions },
          message: "Questions generated successfully",
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

  fastify.post<{
    Body: {
      questionId: string;
      userAnswer: string;
      correctAnswer: string;
      language?: "tr" | "en";
    };
  }>(
    "/generate-explanation",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const {
          questionId,
          userAnswer,
          correctAnswer,
          language = "tr",
        } = request.body as any;

        const explanation = await aiService.generateExplanation({
          questionId,
          userAnswer,
          correctAnswer,
          language,
        });

        const response: ApiResponse = {
          success: true,
          data: { explanation },
          message: "Explanation generated successfully",
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

  fastify.post<{
    Body: {
      message: string;
      context?: {
        lessonId?: string;
        topicId?: string;
        recentQuestions?: string[];
      };
      language?: "tr" | "en";
    };
  }>(
    "/chat",
    {
      preHandler: [fastify.authenticate, userBasedLimiter],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        const { message, context, language = "tr" } = request.body as any;

        const response = await aiService.chatWithAI({
          userId,
          message,
          context,
          language,
        });

        const apiResponse: ApiResponse = {
          success: true,
          data: { response },
          message: "Chat response generated successfully",
        };

        reply.send(apiResponse);
      } catch (error: any) {
        const apiResponse: ApiResponse = {
          success: false,
          error: error.message,
        };

        reply.status(error.statusCode || 500).send(apiResponse);
      }
    }
  );
}
