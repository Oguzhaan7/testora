"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { InProgress } from "@/components/ui/in-progress";

export default function AnalyticsPage() {
  const features = [
    "Detailed learning analytics",
    "Performance metrics and KPIs",
    "Interactive charts and graphs",
    "Comparative analysis tools",
    "Export and sharing capabilities",
  ];

  const breadcrumbs = [{ label: "Analytics" }];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="Analytics"
      breadcrumbs={breadcrumbs}
    >
      <InProgress
        title="Learning Analytics"
        description="Analyze your learning data with detailed charts, insights, and performance metrics."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        estimatedDate="April 2025"
        features={features}
      />
    </AppLayout>
  );
}
