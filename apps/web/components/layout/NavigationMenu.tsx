"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, BarChart3, Calendar, Brain } from "lucide-react";

const navigationItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    key: "study",
    href: "/study",
    icon: BookOpen,
  },
  {
    key: "analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    key: "studyPlans",
    href: "/study-plans",
    icon: Calendar,
  },
  {
    key: "ai",
    href: "/ai-chat",
    icon: Brain,
  },
];

export function NavigationMenu() {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
