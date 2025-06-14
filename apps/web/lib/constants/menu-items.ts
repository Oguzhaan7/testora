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
  },
  {
    icon: Calendar,
    label: "Plans",
    href: "/plans",
  },
  {
    icon: TrendingUp,
    label: "Progress",
    href: "/progress",
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
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: BookOpen,
    label: "Lessons",
    href: "/admin/lessons",
  },
  {
    icon: HelpCircle,
    label: "Questions",
    href: "/admin/questions",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/admin/analytics",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
  },
];
