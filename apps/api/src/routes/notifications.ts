import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { NotificationService } from "@/services/NotificationService";
import mongoose from "mongoose";

export default async function notificationRoutes(fastify: FastifyInstance) {
  const notificationService = new NotificationService();

  fastify.get(
    "/notifications",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).id;
        const { limit, skip, unreadOnly, type } = request.query as {
          limit?: string;
          skip?: string;
          unreadOnly?: string;
          type?: "reminder" | "info" | "promo" | "achievement";
        };

        const options = {
          limit: limit ? parseInt(limit) : undefined,
          skip: skip ? parseInt(skip) : undefined,
          unreadOnly: unreadOnly === "true",
          type,
        };

        const notifications = await notificationService.getUserNotifications(
          new mongoose.Types.ObjectId(userId),
          options
        );

        return reply.code(200).send({
          success: true,
          data: notifications,
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to fetch notifications",
        });
      }
    }
  );

  fastify.get(
    "/notifications/unread-count",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).id;
        const count = await notificationService.getUnreadCount(
          new mongoose.Types.ObjectId(userId)
        );

        return reply.code(200).send({
          success: true,
          data: { count },
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to fetch unread count",
        });
      }
    }
  );

  fastify.patch(
    "/notifications/:id/read",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const success = await notificationService.markAsRead(
          new mongoose.Types.ObjectId(id)
        );

        if (!success) {
          return reply.code(404).send({
            success: false,
            error: "Notification not found",
          });
        }

        return reply.code(200).send({
          success: true,
          message: "Notification marked as read",
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to mark notification as read",
        });
      }
    }
  );

  fastify.patch(
    "/notifications/mark-all-read",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).id;
        const count = await notificationService.markAllAsRead(
          new mongoose.Types.ObjectId(userId)
        );

        return reply.code(200).send({
          success: true,
          data: { markedCount: count },
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to mark all notifications as read",
        });
      }
    }
  );

  fastify.delete(
    "/notifications/:id",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const success = await notificationService.deleteNotification(
          new mongoose.Types.ObjectId(id)
        );

        if (!success) {
          return reply.code(404).send({
            success: false,
            error: "Notification not found",
          });
        }

        return reply.code(200).send({
          success: true,
          message: "Notification deleted successfully",
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to delete notification",
        });
      }
    }
  );

  fastify.post(
    "/notifications/create-reminder",
    {
      preHandler: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).id;
        const { studyPlanId, reminderTime } = request.body as {
          studyPlanId: string;
          reminderTime: string;
        };

        const notification = await notificationService.createStudyReminder(
          new mongoose.Types.ObjectId(userId),
          new mongoose.Types.ObjectId(studyPlanId),
          new Date(reminderTime)
        );

        return reply.code(201).send({
          success: true,
          data: notification,
        });
      } catch (error) {
        return reply.code(500).send({
          success: false,
          error: "Failed to create reminder",
        });
      }
    }
  );
}
