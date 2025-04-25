import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: "fr",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);
