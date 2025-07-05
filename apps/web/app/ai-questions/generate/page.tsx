"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  BookOpen,
  List,
  Zap,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";
import type { Topic, Lesson } from "@/types/lesson.types";
import type { Question } from "@/types/question.types";

export default function GenerateQuestionsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (selectedLesson) {
      fetchTopics(selectedLesson);
    } else {
      setTopics([]);
      setSelectedTopic("");
    }
  }, [selectedLesson]);

  const fetchLessons = async () => {
    try {
      const data = await adminApi.getAllLessons();
      setLessons(data.lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    }
  };

  const fetchTopics = async (lessonId: string) => {
    try {
      const data = await adminApi.getTopicsByLesson(lessonId);
      setTopics(data.topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to load topics");
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedTopic) {
      toast.error("Please select a topic first");
      return;
    }

    try {
      setGenerating(true);
      const data = await adminApi.generateQuestions(
        selectedTopic,
        questionCount,
        {
          lessonId: selectedLesson,
          difficulty: "easy",
          questionType: "multiple_choice",
          language: "tr",
        }
      );
      setGeneratedQuestions(data.questions);
      toast.success(
        `Generated ${data.questions.length} questions successfully!`
      );
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  };

  const getSelectedLessonTitle = () => {
    const lesson = lessons.find((l) => (l._id || l.id) === selectedLesson);
    return lesson?.name || "";
  };

  const getSelectedTopicTitle = () => {
    const topic = topics.find((t) => (t._id || t.id) === selectedTopic);
    return topic?.name || "";
  };

  const breadcrumbs = [
    { label: "AI Question Creator", href: "/ai-questions" },
    { label: "Generate Questions" },
  ];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="Generate Questions"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Generate Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use AI to automatically create engaging questions for your topics
          </p>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Question Generation Settings
            </CardTitle>
            <CardDescription>
              Select a topic and configure your question generation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lesson">Select Lesson</Label>
                <Select
                  value={selectedLesson}
                  onValueChange={setSelectedLesson}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem
                        key={lesson._id || lesson.id}
                        value={lesson._id || lesson.id || ""}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {lesson.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Select Topic</Label>
                <Select
                  value={selectedTopic}
                  onValueChange={setSelectedTopic}
                  disabled={!selectedLesson}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem
                        key={topic._id || topic.id}
                        value={topic._id || topic.id || ""}
                      >
                        <div className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          {topic.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Questions</Label>
              <Input
                id="count"
                type="number"
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(parseInt(e.target.value) || 5)
                }
                min="1"
                max="20"
                className="w-32"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-600">
                {selectedLesson && selectedTopic && (
                  <span>
                    Generating questions for{" "}
                    <strong>{getSelectedTopicTitle()}</strong> in{" "}
                    <strong>{getSelectedLessonTitle()}</strong>
                  </span>
                )}
              </div>
              <Button
                onClick={handleGenerateQuestions}
                disabled={!selectedTopic || generating}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Questions ({generatedQuestions.length})
              </CardTitle>
              <CardDescription>
                Review and manage your AI-generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedQuestions.map((question, index) => (
                  <Card
                    key={question._id || question.id || index}
                    className="border-l-4 border-l-purple-500"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Question {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="font-medium">
                          {question.question || question.questionText}
                        </p>

                        {question.options && question.options.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                              Options:
                            </p>
                            <div className="grid gap-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-2 rounded-md border ${
                                    option === question.correctAnswer
                                      ? "bg-green-50 border-green-200 text-green-700"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}.{" "}
                                  {option}
                                  {option === question.correctAnswer && (
                                    <span className="ml-2 text-sm font-medium">
                                      (Correct)
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm font-medium text-blue-700">
                              Explanation:
                            </p>
                            <p className="text-sm text-blue-600">
                              {question.explanation}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>
                            Type: {question.type || question.questionType}
                          </span>
                          <span>Difficulty: {question.difficulty}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Select Content</p>
                  <p className="text-sm text-gray-600">
                    Choose a lesson and topic for question generation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Configure Settings</p>
                  <p className="text-sm text-gray-600">
                    Set the number of questions to generate
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Generate & Review</p>
                  <p className="text-sm text-gray-600">
                    AI creates questions that you can review and use
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
