import { Types } from "mongoose";
import { Lesson, Topic, Question } from "@/models";
import {
  CreateLessonRequest,
  CreateTopicRequest,
  CreateQuestionRequest,
  UpdateLessonRequest,
  UpdateTopicRequest,
  UpdateQuestionRequest,
} from "@/types/admin";

export class AdminService {
  async createLesson(userId: string, data: CreateLessonRequest) {
    const lesson = new Lesson({
      ...data,
      createdBy: new Types.ObjectId(userId),
    });

    await lesson.save();
    return { lesson };
  }

  async updateLesson(lessonId: string, data: UpdateLessonRequest) {
    const lesson = await Lesson.findByIdAndUpdate(lessonId, data, {
      new: true,
    });

    if (!lesson) {
      const error = new Error("Lesson not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return { lesson };
  }

  async deleteLesson(lessonId: string) {
    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { isActive: false },
      { new: true }
    );

    if (!lesson) {
      const error = new Error("Lesson not found");
      (error as any).statusCode = 404;
      throw error;
    }

    await Topic.updateMany(
      { lessonId: new Types.ObjectId(lessonId) },
      { isActive: false }
    );

    await Question.updateMany(
      { lessonId: new Types.ObjectId(lessonId) },
      { isActive: false }
    );

    return { message: "Lesson deleted successfully" };
  }

  async getAllLessons() {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    return { lessons };
  }

  async createTopic(data: CreateTopicRequest) {
    const lessonExists = await Lesson.findById(data.lessonId);
    if (!lessonExists) {
      const error = new Error("Lesson not found");
      (error as any).statusCode = 404;
      throw error;
    }

    const topic = new Topic({
      ...data,
      lessonId: new Types.ObjectId(data.lessonId),
    });

    await topic.save();
    return { topic };
  }

  async updateTopic(topicId: string, data: UpdateTopicRequest) {
    const topic = await Topic.findByIdAndUpdate(topicId, data, { new: true });

    if (!topic) {
      const error = new Error("Topic not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return { topic };
  }

  async deleteTopic(topicId: string) {
    const topic = await Topic.findByIdAndUpdate(
      topicId,
      { isActive: false },
      { new: true }
    );

    if (!topic) {
      const error = new Error("Topic not found");
      (error as any).statusCode = 404;
      throw error;
    }

    await Question.updateMany(
      { topicId: new Types.ObjectId(topicId) },
      { isActive: false }
    );

    return { message: "Topic deleted successfully" };
  }

  async getTopicsByLesson(lessonId: string) {
    const topics = await Topic.find({
      lessonId: new Types.ObjectId(lessonId),
    }).sort({ order: 1, createdAt: 1 });

    return { topics };
  }

  async createQuestion(data: CreateQuestionRequest) {
    const lessonExists = await Lesson.findById(data.lessonId);
    if (!lessonExists) {
      const error = new Error("Lesson not found");
      (error as any).statusCode = 404;
      throw error;
    }

    const topicExists = await Topic.findById(data.topicId);
    if (!topicExists) {
      const error = new Error("Topic not found");
      (error as any).statusCode = 404;
      throw error;
    }

    const question = new Question({
      ...data,
      lessonId: new Types.ObjectId(data.lessonId),
      topicId: new Types.ObjectId(data.topicId),
    });

    await question.save();
    return { question };
  }

  async updateQuestion(questionId: string, data: UpdateQuestionRequest) {
    const question = await Question.findByIdAndUpdate(questionId, data, {
      new: true,
    });

    if (!question) {
      const error = new Error("Question not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return { question };
  }

  async deleteQuestion(questionId: string) {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { isActive: false },
      { new: true }
    );

    if (!question) {
      const error = new Error("Question not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return { message: "Question deleted successfully" };
  }

  async getQuestionsByTopic(topicId: string) {
    const questions = await Question.find({
      topicId: new Types.ObjectId(topicId),
      isActive: true,
    }).sort({ createdAt: 1 });

    return { questions };
  }

  async getQuestionsByLesson(lessonId: string) {
    const questions = await Question.find({
      lessonId: new Types.ObjectId(lessonId),
      isActive: true,
    }).sort({ createdAt: 1 });

    return { questions };
  }

  async bulkCreateQuestions(questions: CreateQuestionRequest[]) {
    const createdQuestions = [];

    for (const questionData of questions) {
      const lessonExists = await Lesson.findById(questionData.lessonId);
      if (!lessonExists) {
        continue;
      }

      const topicExists = await Topic.findById(questionData.topicId);
      if (!topicExists) {
        continue;
      }

      const question = new Question({
        ...questionData,
        lessonId: new Types.ObjectId(questionData.lessonId),
        topicId: new Types.ObjectId(questionData.topicId),
      });

      await question.save();
      createdQuestions.push(question);
    }

    return { questions: createdQuestions, count: createdQuestions.length };
  }
}
