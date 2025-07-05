"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { List, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";
import type { Topic, Lesson } from "@/types/lesson.types";

export default function TopicsPage() {
  const t = useTranslations();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    lessonId: "",
    name: "",
    description: "",
    content: "",
    difficulty: 1,
    order: 0,
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (selectedLessonId) {
      fetchTopicsForLesson(selectedLessonId);
    } else {
      setTopics([]);
    }
  }, [selectedLessonId]);

  const fetchLessons = async () => {
    try {
      const data = await adminApi.getAllLessons();
      setLessons(data.lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    }
  };

  const fetchTopicsForLesson = async (lessonId: string) => {
    try {
      setLoading(true);
      const data = await adminApi.getTopicsByLesson(lessonId);
      setTopics(data.topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that a lesson is selected
    if (!formData.lessonId) {
      toast.error("Please select a lesson");
      return;
    }

    try {
      if (editingTopic) {
        const topicId = editingTopic._id || editingTopic.id;
        if (!topicId) {
          toast.error("Topic ID is missing");
          return;
        }
        await adminApi.updateTopic(topicId, formData);
        toast.success("Topic updated successfully");
      } else {
        await adminApi.createTopic(formData);
        toast.success("Topic created successfully");
      }
      setDialogOpen(false);
      setEditingTopic(null);
      resetForm();
      if (selectedLessonId) {
        fetchTopicsForLesson(selectedLessonId);
      }
    } catch (error) {
      console.error("Error saving topic:", error);
      toast.error("Failed to save topic");
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      lessonId: topic.lessonId || "",
      name: topic.name || "",
      description: topic.description || "",
      content: topic.content || "",
      difficulty: topic.difficulty || 1,
      order: topic.order || 0,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (topicId: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      await adminApi.deleteTopic(topicId);
      toast.success("Topic deleted successfully");
      if (selectedLessonId) {
        fetchTopicsForLesson(selectedLessonId);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Failed to delete topic");
    }
  };

  const resetForm = () => {
    setFormData({
      lessonId: selectedLessonId,
      name: "",
      description: "",
      content: "",
      difficulty: 1,
      order: 0,
    });
    setEditingTopic(null);
  };

  const getLessonTitle = (lessonId: string) => {
    const lesson = lessons.find((l) => (l._id || l.id) === lessonId);
    return lesson?.name || "Unknown Lesson";
  };

  const breadcrumbs = [
    { label: "AI Question Creator", href: "/ai-questions" },
    { label: "Manage Topics" },
  ];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="Manage Topics"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Topics</h1>
            <p className="text-gray-600 mt-1">
              Create and organize topics within your lessons
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="flex items-center gap-2"
                disabled={!selectedLessonId}
              >
                <Plus className="h-4 w-4" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTopic ? "Edit Topic" : "Create New Topic"}
                </DialogTitle>
                <DialogDescription>
                  {editingTopic
                    ? "Update the topic details below."
                    : "Add a new topic to your lessons."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lessonId">Lesson *</Label>
                  <Select
                    value={formData.lessonId}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, lessonId: value })
                    }
                    disabled={editingTopic !== null}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem
                          key={lesson._id || lesson.id}
                          value={lesson._id || lesson.id || ""}
                        >
                          {lesson.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter topic name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter topic description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter topic content"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty.toString()}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, difficulty: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        {t("difficulty.easy")} (1)
                      </SelectItem>
                      <SelectItem value="2">
                        {t("difficulty.medium")} (2)
                      </SelectItem>
                      <SelectItem value="3">
                        {t("difficulty.hard")} (3)
                      </SelectItem>
                      <SelectItem value="4">
                        {t("difficulty.veryHard")} (4)
                      </SelectItem>
                      <SelectItem value="5">
                        {t("difficulty.expert")} (5)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter order number"
                    min="0"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTopic ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lesson Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Select Lesson
            </CardTitle>
            <CardDescription>
              Choose a lesson to view and manage its topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Select
                value={selectedLessonId}
                onValueChange={setSelectedLessonId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lesson to view topics" />
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
          </CardContent>
        </Card>

        {/* Topics Grid */}
        {!selectedLessonId ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Lesson
              </h3>
              <p className="text-gray-600 mb-4">
                Please select a lesson from above to view and manage its topics.
              </p>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No topics yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first topic to get started with content
                organization.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Topic
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <Card
                key={topic._id || topic.id || index}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">{topic.name}</CardTitle>
                    </div>
                    <div className="text-xs text-gray-500">#{topic.order}</div>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{getLessonTitle(topic.lessonId || "")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Difficulty:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        topic.difficulty === 1
                          ? "bg-green-100 text-green-700"
                          : topic.difficulty === 2
                            ? "bg-yellow-100 text-yellow-700"
                            : topic.difficulty === 3
                              ? "bg-orange-100 text-orange-700"
                              : topic.difficulty === 4
                                ? "bg-red-100 text-red-700"
                                : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {topic.difficulty === 1
                        ? t("difficulty.easy")
                        : topic.difficulty === 2
                          ? t("difficulty.medium")
                          : topic.difficulty === 3
                            ? t("difficulty.hard")
                            : topic.difficulty === 4
                              ? t("difficulty.veryHard")
                              : t("difficulty.expert")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(topic)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(topic._id || topic.id || "")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
