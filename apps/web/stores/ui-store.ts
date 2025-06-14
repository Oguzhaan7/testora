"use client";

import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  mobileMenuOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  closeSidebar: () => set({ sidebarOpen: false }),

  toggleMobileMenu: () =>
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
    })),

  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
