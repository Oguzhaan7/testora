"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { LandingHeader } from "../homepage/LandingHeader";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <AuthenticatedHeader /> : <LandingHeader />}
      {children}
    </>
  );
}
