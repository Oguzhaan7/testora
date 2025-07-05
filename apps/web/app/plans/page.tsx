"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { InProgress } from "@/components/ui/in-progress";

export default function PlansPage() {
  const features = [
    "Personalized study plans",
    "AI-powered plan recommendations",
    "Progress tracking for each plan",
    "Customizable study schedules",
    "Achievement milestones and rewards",
  ];

  const breadcrumbs = [{ label: "Study Plans" }];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="Study Plans"
      breadcrumbs={breadcrumbs}
    >
      <InProgress
        title="Study Plans"
        description="Create and manage personalized study plans to optimize your learning journey."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        estimatedDate="February 2025"
        features={features}
      />
    </AppLayout>
  );
}
