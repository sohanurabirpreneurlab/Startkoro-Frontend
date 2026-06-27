import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readFromStorage, writeToStorage } from "../utils/storage";

type Theme = "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "startkoro.theme";

function applyThemeToDocument(theme: Theme) {
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add(theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = readFromStorage<Theme>(STORAGE_KEY);
    return saved === "light" ? saved : "light";
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    writeToStorage(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState("light"),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
