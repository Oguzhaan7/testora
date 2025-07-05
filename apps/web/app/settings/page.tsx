"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { InProgress } from "@/components/ui/in-progress";

export default function SettingsPage() {
  const features = [
    "Application preferences",
    "Notification settings",
    "Theme and appearance options",
    "Language and localization",
    "Privacy and security settings",
  ];

  const breadcrumbs = [{ label: "Settings" }];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="Settings"
      breadcrumbs={breadcrumbs}
    >
      <InProgress
        title="Settings"
        description="Customize your application preferences and configure system settings."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        estimatedDate="January 2025"
        features={features}
      />
    </AppLayout>
  );
}
