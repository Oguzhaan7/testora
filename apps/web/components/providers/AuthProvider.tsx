"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    setHasMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  if (!hasMounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
