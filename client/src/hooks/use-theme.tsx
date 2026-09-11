import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "writify-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

/**
 * Presentation-only theme toggle. Adds/removes `.dark` on <html> and persists the
 * choice to localStorage (key mirrored by the pre-paint script in index.html so
 * returning dark-mode users don't flash light). Default is light.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable — the in-memory toggle still works for this session */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
};
