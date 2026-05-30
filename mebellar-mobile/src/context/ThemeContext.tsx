import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "mmebel-theme";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(
    system === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((v) => {
      if (v === "dark" || v === "light") setMode(v);
    });
  }, []);

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, isDark: mode === "dark", toggle }),
    [mode, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode ThemeProvider ichida");
  return ctx;
}

export function useThemeColors() {
  const { isDark } = useThemeMode();
  const { colors } = require("../theme/colors");
  return {
    isDark,
    bg: isDark ? colors.dark.bg : colors.surfaceMuted,
    text: isDark ? colors.dark.text : colors.primary,
    card: isDark ? colors.dark.card : colors.surface,
    border: isDark ? colors.dark.border : colors.border,
    accent: colors.accent,
    muted: colors.textMuted,
  };
}
