import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "coffee", // Default theme
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("talksphere-theme", theme);
    }
    set({ theme });
  },
  // Initialize theme from localStorage after component mount
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("talksphere-theme") || "coffee";
      set({ theme: savedTheme });
    }
  }
}));