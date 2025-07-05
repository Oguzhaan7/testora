import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  TrendingUp,
  User,
  Settings,
  Users,
  HelpCircle,
  BarChart,
  Brain,
  List,
  Sparkles,
} from "lucide-react";
import type { SidebarItem } from "@/types/layout.types";

export const appMenuItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: BookOpen,
    label: "Study",
    href: "/study",
    children: [
      {
        icon: List,
        label: "Lessons",
        href: "/study/lessons",
      },
      {
        icon: TrendingUp,
        label: "My Progress",
        href: "/study/progress",
      },
    ],
  },
  {
    icon: Brain,
    label: "AI Question Creator",
    href: "/ai-questions",
    children: [
      {
        icon: List,
        label: "Manage Lessons",
        href: "/ai-questions/lessons",
      },
      {
        icon: List,
        label: "Manage Topics",
        href: "/ai-questions/topics",
      },
      {
        icon: Sparkles,
        label: "Generate Questions",
        href: "/ai-questions/generate",
      },
    ],
  },
  {
    icon: Calendar,
    label: "Study Plans",
    href: "/plans",
  },
  {
    icon: TrendingUp,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

export const adminMenuItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Admin Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "User Management",
    href: "/admin/users",
  },
  {
    icon: BookOpen,
    label: "Content Management",
    href: "/admin/content",
    children: [
      {
        icon: List,
        label: "Lessons",
        href: "/admin/lessons",
      },
      {
        icon: List,
        label: "Topics",
        href: "/admin/topics",
      },
      {
        icon: HelpCircle,
        label: "Questions",
        href: "/admin/questions",
      },
    ],
  },
  {
    icon: Brain,
    label: "AI Tools",
    href: "/admin/ai",
    children: [
      {
        icon: Sparkles,
        label: "Generate Content",
        href: "/admin/ai/generate",
      },
      {
        icon: BarChart,
        label: "AI Analytics",
        href: "/admin/ai/analytics",
      },
    ],
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/analytics",
  },
  {
    icon: Settings,
    label: "System Settings",
    href: "/admin/settings",
  },
];
