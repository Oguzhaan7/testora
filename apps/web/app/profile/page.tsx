"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { appMenuItems } from "@/lib/constants/menu-items";
import { InProgress } from "@/components/ui/in-progress";

export default function ProfilePage() {
  const features = [
    "Complete profile management",
    "Avatar and personal information",
    "Learning preferences settings",
    "Achievement badges and trophies",
    "Account security settings",
  ];

  const breadcrumbs = [{ label: "Profile" }];

  return (
    <AppLayout
      sidebarItems={appMenuItems}
      pageTitle="Profile"
      breadcrumbs={breadcrumbs}
    >
      <InProgress
        title="User Profile"
        description="Manage your profile, preferences, and account settings."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        estimatedDate="March 2025"
        features={features}
      />
    </AppLayout>
  );
}
