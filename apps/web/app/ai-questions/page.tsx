"use client";

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
import { Brain, BookOpen, List, Sparkles, Plus, Zap } from "lucide-react";
import Link from "next/link";

export default function AIQuestionsPage() {
  const breadcrumbs = [{ label: "AI Question Creator" }];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="AI Question Creator"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-fit">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Question Creator
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create engaging questions and manage your learning content with the
            power of AI
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <Link href="/ai-questions/lessons">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Manage Lessons</CardTitle>
                    <CardDescription>
                      Create and organize lesson topics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organize your curriculum by creating lessons and adding topics
                  to structure your learning content.
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <Link href="/ai-questions/topics">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <List className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Manage Topics</CardTitle>
                    <CardDescription>
                      Fine-tune your learning topics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add detailed topics to your lessons and prepare them for
                  AI-powered question generation.
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow group cursor-pointer border-purple-200">
            <Link href="/ai-questions/generate">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-purple-700">
                      Generate Questions
                    </CardTitle>
                    <CardDescription>
                      AI-powered question creation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Let AI create diverse, engaging questions automatically based
                  on your topics and learning objectives.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI-Powered Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Smart Question Generation</p>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes your topics to create relevant, varied questions
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Adaptive Difficulty</p>
                  <p className="text-sm text-muted-foreground">
                    Questions automatically adjust to appropriate difficulty
                    levels
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Multiple Formats</p>
                  <p className="text-sm text-muted-foreground">
                    Support for multiple choice, true/false, and essay questions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Create a Lesson</p>
                  <p className="text-sm text-muted-foreground">
                    Start by creating a lesson to organize your content
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Add Topics</p>
                  <p className="text-sm text-muted-foreground">
                    Define specific topics within your lesson
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Generate Questions</p>
                  <p className="text-sm text-muted-foreground">
                    Use AI to create questions for your topics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
