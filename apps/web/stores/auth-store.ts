"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "@/types/auth.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const isProduction = process.env.NODE_ENV === "production";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    Cookies.set("auth-token", token, {
      expires: 7,
      secure: isProduction,
      sameSite: "strict",
    });
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    Cookies.remove("auth-token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    const token = Cookies.get("auth-token");
    if (token) {
      set({
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));
