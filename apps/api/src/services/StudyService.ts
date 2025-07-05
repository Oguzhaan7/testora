import {
  User,
  Lesson,
  Topic,
  Question,
  StudyPlan,
  UserSession,
  UserProgress,
  QuestionAttempt,
} from "@/models";
import { AdminService } from "./AdminService";
import { IUserSession } from "@/models/UserSession";
import { IQuestion } from "@/models/Question";
import { IStudyPlan, IPlanItem } from "@/models/StudyPlan";
import {
  ValidationError,
  NotFoundError,
  StartStudySessionRequest,
  SubmitAnswerRequest,
} from "@/types";
import { aiService } from "./AIService";
import mongoose from "mongoose";

export interface StudySessionResponse {
  session: IUserSession;
  currentQuestion?: IQuestion | null;
  progress: {
    questionsAttempted: number;
    totalQuestions: number;
    correctAnswers: number;
    timeElapsed: number;
  };
}

export class StudyService {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }
  async getLessons(level?: string, category?: string) {
    const filter: any = { isActive: true };

    if (level) filter.level = level;
    if (category) filter.category = new RegExp(category, "i");

    const lessons = await Lesson.find(filter).sort({ name: 1 });
    return lessons;
  }

  async getTopicsByLesson(lessonId: string) {
    const topics = await Topic.find({
      lessonId: new mongoose.Types.ObjectId(lessonId),
      isActive: true,
    }).sort({ difficulty: 1, name: 1 });

    return topics;
  }

  async startStudySession(
    userId: string,
    sessionData: StartStudySessionRequest
  ): Promise<StudySessionResponse> {
    const {
      lessonId,
      topicId,
      sessionType,
      questionCount = 10,
      difficulty,
    } = sessionData;

    const lesson = await Lesson.findById(lessonId);
    const topic = await Topic.findById(topicId);

    if (!lesson || !topic) {
      throw new NotFoundError("Lesson or topic not found");
    }

    const activeSession = await UserSession.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      completed: false,
    });

    if (activeSession) {
      throw new ValidationError(
        "You have an active study session. Please complete or end it first"
      );
    }

    const userProgress = await UserProgress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      lessonId: new mongoose.Types.ObjectId(lessonId),
      topicId: new mongoose.Types.ObjectId(topicId),
    });

    let sessionDifficulty = difficulty;
    if (!sessionDifficulty && userProgress) {
      if (userProgress.mastery >= 80) sessionDifficulty = "hard";
      else if (userProgress.mastery >= 50) sessionDifficulty = "medium";
      else sessionDifficulty = "easy";
    } else if (!sessionDifficulty) {
      sessionDifficulty = "easy";
    }

    const session = new UserSession({
      userId: new mongoose.Types.ObjectId(userId),
      lessonId: new mongoose.Types.ObjectId(lessonId),
      topicId: new mongoose.Types.ObjectId(topicId),
      sessionType,
      startTime: new Date(),
      questionsAttempted: 0,
      correctAnswers: 0,
      totalTime: 0,
      avgTimePerQuestion: 0,
      score: 0,
      completed: false,
    });

    await session.save();

    const firstQuestion = await this.getNextQuestion(
      (session._id as mongoose.Types.ObjectId).toString(),
      sessionDifficulty,
      questionCount
    );

    return {
      session,
      currentQuestion: firstQuestion,
      progress: {
        questionsAttempted: 0,
        totalQuestions: questionCount,
        correctAnswers: 0,
        timeElapsed: 0,
      },
    };
  }

  async getNextQuestion(
    sessionId: string,
    difficulty: string,
    totalQuestions: number
  ): Promise<IQuestion | null> {
    const session = await UserSession.findById(sessionId);
    if (!session) throw new NotFoundError("Session not found");

    if (session.questionsAttempted >= totalQuestions) {
      return null;
    }

    const attemptedQuestions = await QuestionAttempt.find({
      sessionId: new mongoose.Types.ObjectId(sessionId),
    }).select("questionId");

    const excludeIds = attemptedQuestions.map((a) => a.questionId);

    const question = await Question.findOne({
      lessonId: session.lessonId,
      topicId: session.topicId,
      difficulty,
      isActive: true,
      _id: { $nin: excludeIds },
    });

    return question;
  }

  async submitAnswer(userId: string, answerData: SubmitAnswerRequest) {
    const {
      sessionId,
      questionId,
      selectedOption,
      timeSpent,
      hintsUsed = 0,
    } = answerData;

    const session = await UserSession.findById(sessionId);
    const question = await Question.findById(questionId);

    if (!session || !question) {
      throw new NotFoundError("Session or question not found");
    }

    if (session.userId.toString() !== userId) {
      throw new ValidationError("Unauthorized session access");
    }

    const isCorrect = this.checkAnswer(question, selectedOption);

    const attempt = new QuestionAttempt({
      userId: new mongoose.Types.ObjectId(userId),
      questionId: new mongoose.Types.ObjectId(questionId),
      sessionId: new mongoose.Types.ObjectId(sessionId),
      selectedOption,
      isCorrect,
      timeSpent,
      hintsUsed,
      attemptedAt: new Date(),
    });

    await attempt.save();

    session.questionsAttempted += 1;
    if (isCorrect) session.correctAnswers += 1;
    session.totalTime += timeSpent;
    session.avgTimePerQuestion = session.totalTime / session.questionsAttempted;
    session.score = Math.round(
      (session.correctAnswers / session.questionsAttempted) * 100
    );

    await session.save();

    await this.updateQuestionStats(questionId, isCorrect, timeSpent);

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      progress: {
        questionsAttempted: session.questionsAttempted,
        correctAnswers: session.correctAnswers,
        score: session.score,
        timeElapsed: session.totalTime,
      },
    };
  }

  async endStudySession(userId: string, sessionId: string) {
    const session = await UserSession.findById(sessionId);

    if (!session) {
      throw new NotFoundError("Session not found");
    }

    if (session.userId.toString() !== userId) {
      throw new ValidationError("Unauthorized session access");
    }

    session.endTime = new Date();
    session.completed = true;
    await session.save();

    await this.updateUserProgress(userId, session);

    const sessionStats: any = {
      sessionId: session._id,
      duration: session.totalTime,
      questionsAttempted: session.questionsAttempted,
      correctAnswers: session.correctAnswers,
      score: session.score,
      avgTimePerQuestion: session.avgTimePerQuestion,
    };

    if (session.score < 60) {
      try {
        const recommendations = await this.generatePerformanceRecommendations(
          userId,
          sessionId
        );
        sessionStats.recommendations = recommendations;
      } catch (error) {
        console.error("Failed to generate recommendations:", error);
      }
    }

    return sessionStats;
  }

  async generatePerformanceRecommendations(
    userId: string,
    sessionId: string
  ): Promise<string> {
    const session = await UserSession.findById(sessionId)
      .populate("lessonId", "name")
      .populate("topicId", "name");

    if (!session) {
      throw new NotFoundError("Session not found");
    }

    const recentAttempts = await QuestionAttempt.find({
      userId: new mongoose.Types.ObjectId(userId),
      sessionId: new mongoose.Types.ObjectId(sessionId),
    })
      .populate("questionId")
      .limit(5);

    const context = {
      lessonId: session.lessonId._id.toString(),
      topicId: session.topicId._id.toString(),
      recentQuestions: recentAttempts.map(
        (attempt) =>
          `${(attempt.questionId as any).questionText} - ${attempt.isCorrect ? "Correct" : "Incorrect"}`
      ),
    };

    const lessonName = (session.lessonId as any).name;
    const topicName = (session.topicId as any).name;

    const message = `I just completed a study session on "${lessonName}" - "${topicName}" topic. 
    My score was ${session.score}% (${session.correctAnswers}/${session.questionsAttempted} correct).
    Average time per question: ${session.avgTimePerQuestion} seconds.
    Can you provide specific recommendations to improve my performance?`;

    return await aiService.chatWithAI({
      userId,
      message,
      context,
      language: "en",
    });
  }

  async getAIExplanation(
    userId: string,
    questionId: string,
    userAnswer: string,
    language: "tr" | "en" = "tr"
  ): Promise<string> {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }

    return await aiService.generateExplanation({
      questionId,
      userAnswer,
      correctAnswer: question.correctAnswer.toString(),
      language,
    });
  }

  private checkAnswer(
    question: IQuestion,
    selectedOption: string | number
  ): boolean {
    if (question.questionType === "multiple_choice") {
      return question.correctAnswer === selectedOption;
    } else if (question.questionType === "true_false") {
      return (
        question.correctAnswer.toString().toLowerCase() ===
        selectedOption.toString().toLowerCase()
      );
    }

    return false;
  }

  private async updateQuestionStats(
    questionId: string,
    isCorrect: boolean,
    timeSpent: number
  ) {
    const question = await Question.findById(questionId);
    if (!question) return;

    question.usageCount += 1;

    const totalAttempts = await QuestionAttempt.countDocuments({ questionId });
    const correctAttempts = await QuestionAttempt.countDocuments({
      questionId,
      isCorrect: true,
    });
    question.successRate = Math.round((correctAttempts / totalAttempts) * 100);

    const attempts = await QuestionAttempt.find({ questionId }).select(
      "timeSpent"
    );
    const totalTime = attempts.reduce(
      (sum, attempt) => sum + attempt.timeSpent,
      0
    );
    question.avgSolveTime = Math.round(totalTime / attempts.length);

    await question.save();
  }

  private async updateUserProgress(userId: string, session: IUserSession) {
    let progress = await UserProgress.findOne({
      userId: session.userId,
      lessonId: session.lessonId,
      topicId: session.topicId,
    });

    if (!progress) {
      progress = new UserProgress({
        userId: session.userId,
        lessonId: session.lessonId,
        topicId: session.topicId,
        mastery: 0,
        streakDays: 0,
        lastStudied: new Date(),
        totalTimeSpent: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        weaknesses: [],
        strengths: [],
        difficulty: "easy",
      });
    }

    progress.totalQuestions += session.questionsAttempted;
    progress.correctAnswers += session.correctAnswers;
    progress.totalTimeSpent += session.totalTime;
    progress.lastStudied = new Date();

    const successRate =
      (progress.correctAnswers / progress.totalQuestions) * 100;
    progress.mastery = Math.min(100, Math.round(successRate));

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (progress.lastStudied >= yesterday) {
      progress.streakDays += 1;
    } else {
      progress.streakDays = 1;
    }

    if (progress.mastery >= 80) progress.difficulty = "hard";
    else if (progress.mastery >= 50) progress.difficulty = "medium";
    else progress.difficulty = "easy";

    await progress.save();
  }

  async getUserProgress(userId: string, lessonId?: string, topicId?: string) {
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (lessonId) filter.lessonId = new mongoose.Types.ObjectId(lessonId);
    if (topicId) filter.topicId = new mongoose.Types.ObjectId(topicId);

    const progress = await UserProgress.find(filter)
      .populate("lessonId", "name")
      .populate("topicId", "name")
      .sort({ updatedAt: -1 });

    return progress;
  }

  async getActiveSession(userId: string) {
    const activeSession = await UserSession.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      completed: false,
    }).populate("lessonId topicId");

    if (activeSession) {
      const sessionObject = activeSession.toObject();
      if (
        sessionObject.lessonId &&
        typeof sessionObject.lessonId === "object"
      ) {
        sessionObject.lessonId = (sessionObject.lessonId as any)._id.toString();
      }
      if (sessionObject.topicId && typeof sessionObject.topicId === "object") {
        sessionObject.topicId = (sessionObject.topicId as any)._id.toString();
      }
      return sessionObject;
    }

    return activeSession;
  }
  async getSessionQuestion(userId: string, sessionId: string) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new NotFoundError("Invalid session ID format");
    }

    const session = await UserSession.findById(sessionId);

    if (!session) {
      throw new NotFoundError("Session not found");
    }

    if (session.userId.toString() !== userId) {
      throw new ValidationError("Unauthorized session access");
    }

    if (session.completed) {
      throw new ValidationError("Session already completed");
    }

    const excludeIds = await QuestionAttempt.find({
      sessionId: new mongoose.Types.ObjectId(sessionId),
    }).distinct("questionId");

    const excludeIdsString = excludeIds.map((id) => id.toString());

    let questions = await this.adminService.getQuestionsByTopic(
      session.topicId.toString()
    );
    let availableQuestions = questions.questions?.filter(
      (q: any) => !excludeIdsString.includes(q._id.toString())
    );

    if (!availableQuestions || availableQuestions.length === 0) {
      const lessonQuestions = await this.adminService.getQuestionsByLesson(
        session.lessonId.toString()
      );
      availableQuestions = lessonQuestions.questions?.filter(
        (q: any) => !excludeIdsString.includes(q._id.toString())
      );
    }

    if (!availableQuestions || availableQuestions.length === 0) {
      throw new NotFoundError("No more questions available");
    }

    const question =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    return question;
  }

  async endSession(userId: string, sessionId: string) {
    const session = await UserSession.findById(sessionId);

    if (!session) {
      throw new NotFoundError("Session not found");
    }

    if (session.userId.toString() !== userId) {
      throw new ValidationError("Unauthorized session access");
    }

    if (session.completed) {
      throw new ValidationError("Session already completed");
    }

    session.completed = true;
    session.endTime = new Date();
    session.score = Math.round(
      (session.correctAnswers / session.questionsAttempted) * 100
    );
    await session.save();

    const summary = {
      totalQuestions: session.questionsAttempted,
      correctAnswers: session.correctAnswers,
      incorrectAnswers: session.questionsAttempted - session.correctAnswers,
      accuracy: session.score,
      timeSpent: session.totalTime,
      completedAt: session.endTime.toISOString(),
    };

    return { session, summary };
  }
}
