"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { InProgress } from "@/components/ui/in-progress";

export default function ProgressPage() {
  const features = [
    "Detailed progress tracking",
    "Learning analytics and insights",
    "Performance comparison charts",
    "Study streak tracking",
    "Goal setting and achievement tracking",
  ];

  const breadcrumbs = [
    { label: "Study", href: "/study" },
    { label: "Progress" },
  ];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="My Progress"
      breadcrumbs={breadcrumbs}
    >
      <InProgress
        title="Progress Tracking"
        description="Track your learning progress, view detailed analytics, and monitor your achievements."
        backHref="/study"
        backLabel="Back to Study"
        estimatedDate="March 2025"
        features={features}
      />
    </AppLayout>
  );
}
