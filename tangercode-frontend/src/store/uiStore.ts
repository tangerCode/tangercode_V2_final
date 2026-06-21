import { create } from "zustand";
import type { Locale } from "@/types/ui";

interface UIState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useUIStore = create<UIState>((set) => ({
  locale: "fr",
  setLocale: (locale) => set({ locale }),
}));
