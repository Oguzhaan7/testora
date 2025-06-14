"use client";

import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import type { AppLayoutProps } from "@/types/layout.types";

export function AppLayout({
  children,
  sidebarItems,
  pageTitle,
  breadcrumbs,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar
        items={sidebarItems}
        className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
      />

      {/* Mobile Sidebar */}
      <AppSidebar
        items={sidebarItems}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        className="lg:hidden"
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        <AppHeader
          onMenuClick={handleMenuClick}
          pageTitle={pageTitle}
          breadcrumbs={breadcrumbs}
        />

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
