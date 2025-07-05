import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/config";
import { Question, Lesson, Topic, AICache, AIPrompt } from "@/models";
import { IQuestion } from "@/models/Question";
import {
  ValidationError,
  GenerateQuestionRequest,
  GenerateStudyPlanRequest,
  GenerateExplanationRequest,
  AIChatRequest,
} from "@/types";
import mongoose from "mongoose";
import crypto from "crypto";

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!config.ai.geminiApiKey) {
      throw new Error("Google Gemini API key is required");
    }

    this.genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateQuestions(
    request: GenerateQuestionRequest
  ): Promise<IQuestion[]> {
    const {
      lessonId,
      topicId,
      difficulty,
      questionType,
      count = 1,
      language = "tr",
    } = request;

    const cacheKey = this.generateCacheKey(request);
    const cached = await this.getCachedQuestions(cacheKey);
    if (cached && cached.length >= count) {
      return cached.slice(0, count);
    }

    const lesson = await Lesson.findById(lessonId);
    const topic = await Topic.findById(topicId);

    if (!lesson || !topic) {
      throw new ValidationError("Lesson or topic not found");
    }

    const prompt = this.buildQuestionPrompt(
      lesson,
      topic,
      difficulty,
      questionType,
      count,
      language
    );

    try {
      const startTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const latency = Date.now() - startTime;

      const questions = this.parseQuestionResponse(
        responseText,
        lessonId,
        topicId,
        difficulty,
        questionType
      );

      await this.logAIInteraction({
        userId: "system",
        action: "generateQuestion",
        prompt,
        response: responseText,
        modelUsed: "gemini-1.5-flash",
        tokensUsed: this.estimateTokens(prompt + responseText),
        latencyMs: latency,
        success: true,
      });

      await this.cacheQuestions(cacheKey, questions);

      return questions;
    } catch (error: any) {
      await this.logAIInteraction({
        userId: "system",
        action: "generateQuestion",
        prompt,
        response: "",
        modelUsed: "gemini-1.5-flash",
        tokensUsed: 0,
        latencyMs: 0,
        success: false,
        error: error.message,
      });

      throw new Error(`AI question generation failed: ${error.message}`);
    }
  }

  async generateStudyPlan(request: GenerateStudyPlanRequest): Promise<any> {
    const {
      userId,
      examType,
      targetDate,
      studyTimePerDay,
      currentLevel,
      weakAreas = [],
      language = "tr",
    } = request;

    const prompt = this.buildStudyPlanPrompt(
      examType,
      targetDate,
      studyTimePerDay,
      currentLevel,
      weakAreas,
      language
    );

    try {
      const startTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const latency = Date.now() - startTime;

      const studyPlan = this.parseStudyPlanResponse(responseText);

      await this.logAIInteraction({
        userId,
        action: "generatePlan",
        prompt,
        response: responseText,
        modelUsed: "gemini-1.5-flash",
        tokensUsed: this.estimateTokens(prompt + responseText),
        latencyMs: latency,
        success: true,
      });

      return studyPlan;
    } catch (error: any) {
      await this.logAIInteraction({
        userId,
        action: "generatePlan",
        prompt,
        response: "",
        modelUsed: "gemini-1.5-flash",
        tokensUsed: 0,
        latencyMs: 0,
        success: false,
        error: error.message,
      });

      throw new Error(`AI study plan generation failed: ${error.message}`);
    }
  }

  async generateExplanation(
    request: GenerateExplanationRequest
  ): Promise<string> {
    const { questionId, userAnswer, correctAnswer, language = "tr" } = request;

    const question = await Question.findById(questionId)
      .populate("lessonId", "name")
      .populate("topicId", "name");

    if (!question) {
      throw new ValidationError("Question not found");
    }

    const prompt = this.buildExplanationPrompt(
      question,
      userAnswer,
      correctAnswer,
      language
    );

    try {
      const startTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const latency = Date.now() - startTime;

      await this.logAIInteraction({
        userId: "system",
        action: "generateExplanation",
        prompt,
        response: responseText,
        modelUsed: "gemini-1.5-flash",
        tokensUsed: this.estimateTokens(prompt + responseText),
        latencyMs: latency,
        success: true,
      });

      return responseText;
    } catch (error: any) {
      await this.logAIInteraction({
        userId: "system",
        action: "generateExplanation",
        prompt,
        response: "",
        modelUsed: "gemini-1.5-flash",
        tokensUsed: 0,
        latencyMs: 0,
        success: false,
        error: error.message,
      });

      throw new Error(`AI explanation generation failed: ${error.message}`);
    }
  }

  async chatWithAI(request: AIChatRequest): Promise<string> {
    const { userId, message, context, language = "tr" } = request;

    const prompt = this.buildChatPrompt(message, context, language);

    try {
      const startTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const latency = Date.now() - startTime;

      await this.logAIInteraction({
        userId,
        action: "chatResponse",
        prompt,
        response: responseText,
        modelUsed: "gemini-1.5-flash",
        tokensUsed: this.estimateTokens(prompt + responseText),
        latencyMs: latency,
        success: true,
      });

      return responseText;
    } catch (error: any) {
      await this.logAIInteraction({
        userId,
        action: "chatResponse",
        prompt,
        response: "",
        modelUsed: "gemini-1.5-flash",
        tokensUsed: 0,
        latencyMs: 0,
        success: false,
        error: error.message,
      });

      throw new Error(`AI chat failed: ${error.message}`);
    }
  }

  private generateCacheKey(request: GenerateQuestionRequest): string {
    const data = `${request.lessonId}-${request.topicId}-${request.difficulty}-${request.questionType}-${request.count}`;
    return crypto.createHash("md5").update(data).digest("hex");
  }

  private async getCachedQuestions(cacheKey: string): Promise<IQuestion[]> {
    const cached = await AICache.findOne({ promptHash: cacheKey });
    if (cached) {
      cached.usageCount += 1;
      cached.lastUsed = new Date();
      await cached.save();

      return await Question.find({ _id: { $in: cached.questionSet } });
    }
    return [];
  }

  private async cacheQuestions(
    cacheKey: string,
    questions: IQuestion[]
  ): Promise<void> {
    const savedQuestions = await Question.insertMany(questions);
    const questionIds = savedQuestions.map((q) => q._id);

    await AICache.create({
      lessonId: questions[0].lessonId,
      topicId: questions[0].topicId,
      promptHash: cacheKey,
      difficulty: questions[0].difficulty,
      questionSet: questionIds,
      usageCount: 1,
      lastUsed: new Date(),
    });
  }

  private buildQuestionPrompt(
    lesson: any,
    topic: any,
    difficulty: string,
    questionType: string,
    count: number,
    language: string
  ): string {
    const isTurkish = language === "tr";

    const isEnglishLesson =
      lesson.name.toLowerCase().includes("english") ||
      lesson.category?.toLowerCase().includes("english");
    const contentLanguage = isEnglishLesson ? "en" : language;

    return `
${isTurkish ? "Eğitim soruları oluştur." : "Generate educational questions."}

${isTurkish ? "Ders" : "Lesson"}: ${lesson.name}
${isTurkish ? "Konu" : "Topic"}: ${topic.name}
${isTurkish ? "Açıklama" : "Description"}: ${topic.description}
${isTurkish ? "Zorluk" : "Difficulty"}: ${difficulty}
${isTurkish ? "Soru Tipi" : "Question Type"}: ${questionType}
${isTurkish ? "Soru Sayısı" : "Number of Questions"}: ${count}
${isTurkish ? "İçerik Dili" : "Content Language"}: ${contentLanguage === "en" ? "English" : "Türkçe"}

${
  isTurkish
    ? `Lütfen aşağıdaki JSON formatında ${count} adet ${difficulty} seviyesinde ${questionType} sorusu oluştur.
    Soru içeriği ${contentLanguage === "en" ? "İngilizce" : "Türkçe"} olmalıdır:`
    : `Please create ${count} ${difficulty} level ${questionType} questions in the following JSON format.
    Question content should be in ${contentLanguage === "en" ? "English" : "Turkish"}:`
}

{
  "questions": [
    {
      "questionText": "${isTurkish ? "Soru metni" : "Question text"}",
      "options": ["A", "B", "C", "D"], // ${isTurkish ? "Çoktan seçmelide" : "For multiple choice"}
      "correctAnswer": "${isTurkish ? "Doğru cevap" : "Correct answer"}",
      "explanation": "${isTurkish ? "Açıklama" : "Explanation"}",
      "hint": "${isTurkish ? "İpucu" : "Hint"}",
      "tags": ["${isTurkish ? "etiket1" : "tag1"}", "${isTurkish ? "etiket2" : "tag2"}"]
    }
  ]
}

${
  isTurkish
    ? "Sorular eğitici, net ve konuya uygun olmalıdır. Açıklamalar detaylı olmalıdır."
    : "Questions should be educational, clear, and relevant to the topic. Explanations should be detailed."
}
`;
  }

  private buildStudyPlanPrompt(
    examType: string,
    targetDate: Date,
    studyTimePerDay: number,
    currentLevel: string,
    weakAreas: string[],
    language: string
  ): string {
    const isTurkish = language === "tr";
    const daysUntilExam = Math.ceil(
      (targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return `
${isTurkish ? "Kişiselleştirilmiş çalışma planı oluştur." : "Create a personalized study plan."}

${isTurkish ? "Sınav Türü" : "Exam Type"}: ${examType}
${isTurkish ? "Hedef Tarih" : "Target Date"}: ${targetDate.toLocaleDateString()}
${isTurkish ? "Kalan Gün" : "Days Remaining"}: ${daysUntilExam}
${isTurkish ? "Günlük Çalışma Süresi" : "Daily Study Time"}: ${studyTimePerDay} ${isTurkish ? "dakika" : "minutes"}
${isTurkish ? "Mevcut Seviye" : "Current Level"}: ${currentLevel}
${isTurkish ? "Zayıf Alanlar" : "Weak Areas"}: ${weakAreas.join(", ")}

${
  isTurkish
    ? "Lütfen aşağıdaki JSON formatında detaylı bir çalışma planı oluştur:"
    : "Please create a detailed study plan in the following JSON format:"
}

{
  "title": "${isTurkish ? "Plan başlığı" : "Plan title"}",
  "description": "${isTurkish ? "Plan açıklaması" : "Plan description"}",
  "totalWeeks": ${Math.ceil(daysUntilExam / 7)},
  "dailyTimeMinutes": ${studyTimePerDay},
  "phases": [
    {
      "phase": "${isTurkish ? "Faz adı" : "Phase name"}",
      "duration": "${isTurkish ? "Süre" : "Duration"}",
      "focus": "${isTurkish ? "Odak alanı" : "Focus area"}",
      "activities": ["${isTurkish ? "Etkinlik 1" : "Activity 1"}", "${isTurkish ? "Etkinlik 2" : "Activity 2"}"]
    }
  ],
  "weeklySchedule": [
    {
      "week": 1,
      "topics": ["${isTurkish ? "Konu 1" : "Topic 1"}", "${isTurkish ? "Konu 2" : "Topic 2"}"],
      "goals": ["${isTurkish ? "Hedef 1" : "Goal 1"}", "${isTurkish ? "Hedef 2" : "Goal 2"}"]
    }
  ],
  "recommendations": ["${isTurkish ? "Öneri 1" : "Recommendation 1"}", "${isTurkish ? "Öneri 2" : "Recommendation 2"}"]
}

${
  isTurkish
    ? "Plan gerçekçi, motive edici ve hedefe odaklı olmalıdır."
    : "The plan should be realistic, motivating, and goal-focused."
}
`;
  }

  private buildExplanationPrompt(
    question: any,
    userAnswer: string,
    correctAnswer: string,
    language: string
  ): string {
    const isTurkish = language === "tr";

    return `
${isTurkish ? "Soru çözümü ve açıklama oluştur." : "Create question solution and explanation."}

${isTurkish ? "Soru" : "Question"}: ${question.questionText}
${isTurkish ? "Seçenekler" : "Options"}: ${question.options?.join(", ") || "N/A"}
${isTurkish ? "Kullanıcı Cevabı" : "User Answer"}: ${userAnswer}
${isTurkish ? "Doğru Cevap" : "Correct Answer"}: ${correctAnswer}
${isTurkish ? "Ders" : "Lesson"}: ${question.lessonId?.name || "N/A"}
${isTurkish ? "Konu" : "Topic"}: ${question.topicId?.name || "N/A"}

${
  isTurkish
    ? "Lütfen aşağıdaki konuları içeren detaylı bir açıklama yaz:"
    : "Please write a detailed explanation covering the following:"
}

1. ${isTurkish ? "Doğru cevabın neden doğru olduğu" : "Why the correct answer is correct"}
2. ${isTurkish ? "Yanlış cevabın neden yanlış olduğu (varsa)" : "Why the incorrect answer is wrong (if applicable)"}
3. ${isTurkish ? "Konuyla ilgili önemli noktalar" : "Important points about the topic"}
4. ${isTurkish ? "Hatırlatılması gereken kavramlar" : "Key concepts to remember"}
5. ${isTurkish ? "Benzer sorular için ipuçları" : "Tips for similar questions"}

${
  isTurkish
    ? "Açıklama anlaşılır, eğitici ve motive edici olmalıdır."
    : "The explanation should be clear, educational, and motivating."
}
`;
  }

  private buildChatPrompt(
    message: string,
    context: any,
    language: string
  ): string {
    const isTurkish = language === "tr";

    return `
${
  isTurkish
    ? "Sen Testora eğitim platformunun AI asistanısın. Öğrencilere yardımcı olmak için buradası."
    : "You are Testora's AI assistant. You're here to help students with their studies."
}

${isTurkish ? "Kullanıcı Mesajı" : "User Message"}: ${message}

${
  context
    ? `
${isTurkish ? "Bağlam" : "Context"}:
${context.lessonId ? `${isTurkish ? "Ders" : "Lesson"}: ${context.lessonId}` : ""}
${context.topicId ? `${isTurkish ? "Konu" : "Topic"}: ${context.topicId}` : ""}
${context.recentQuestions ? `${isTurkish ? "Son Sorular" : "Recent Questions"}: ${context.recentQuestions.join(", ")}` : ""}
`
    : ""
}

${
  isTurkish
    ? "Lütfen yararlı, destekleyici ve eğitici bir yanıt ver. Yanıtın açık ve anlaşılır olsun."
    : "Please provide a helpful, supportive, and educational response. Make your answer clear and understandable."
}
`;
  }

  private parseQuestionResponse(
    response: string,
    lessonId: string,
    topicId: string,
    difficulty: string,
    questionType: string
  ): IQuestion[] {
    try {
      const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleanResponse);

      return parsed.questions.map((q: any) => ({
        lessonId: new mongoose.Types.ObjectId(lessonId),
        topicId: new mongoose.Types.ObjectId(topicId),
        difficulty,
        questionType,
        questionText: q.questionText,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        hint: q.hint || "",
        explanation: q.explanation || "",
        tags: q.tags || [],
        createdBy: "ai",
        aiModel: "gemini-1.5-flash",
        usageCount: 0,
        avgSolveTime: 0,
        successRate: 0,
        isActive: true,
      }));
    } catch (error: any) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  private parseStudyPlanResponse(response: string): any {
    try {
      const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleanResponse);
    } catch (error: any) {
      throw new Error(`Failed to parse study plan response: ${error.message}`);
    }
  }

  private async logAIInteraction(data: {
    userId: string;
    action: string;
    prompt: string;
    response: string;
    modelUsed: string;
    tokensUsed: number;
    latencyMs: number;
    success: boolean;
    error?: string;
  }): Promise<void> {
    try {
      await AIPrompt.create({
        userId: new mongoose.Types.ObjectId(data.userId),
        action: data.action,
        prompt: data.prompt,
        response: data.response,
        modelUsed: data.modelUsed,
        tokensUsed: data.tokensUsed,
        latencyMs: data.latencyMs,
        success: data.success,
        error: data.error,
      });
    } catch (error) {
      console.error("Failed to log AI interaction:", error);
    }
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length / 0.75);
  }
}

export const aiService = new AIService();
