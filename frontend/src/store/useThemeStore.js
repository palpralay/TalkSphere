import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  theme: "coffee", // Default theme
  isInitialized: false,
  
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("talksphere-theme", theme);
      // Apply theme to document immediately
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
  
  // Initialize theme from localStorage
  initTheme: () => {
    if (typeof window !== 'undefined' && !get().isInitialized) {
      const savedTheme = localStorage.getItem("talksphere-theme") || "coffee";
      document.documentElement.setAttribute('data-theme', savedTheme);
      set({ theme: savedTheme, isInitialized: true });
    }
  }
}));