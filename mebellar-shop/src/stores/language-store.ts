"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultLocale,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/i18n/config";

function syncLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

interface LanguageState {
  locale: Locale;
  hydrated: boolean;
  setLocale: (locale: Locale) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      hydrated: false,
      setLocale: (locale) => {
        syncLocale(locale);
        set({ locale });
      },
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: LOCALE_STORAGE_KEY,
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) syncLocale(state.locale);
        useLanguageStore.setState({ hydrated: true });
      },
    }
  )
);
