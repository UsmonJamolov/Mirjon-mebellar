"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, type Locale } from "@/i18n/config";
import { useLanguageStore } from "@/stores/language-store";
import uzMessages from "@/messages/uz.json";
import ruMessages from "@/messages/ru.json";

const allMessages: Record<Locale, typeof uzMessages> = {
  uz: uzMessages,
  ru: ruMessages,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useLanguageStore((s) => s.locale);
  const hydrated = useLanguageStore((s) => s.hydrated);
  const setHydrated = useLanguageStore((s) => s.setHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hydrated) setHydrated(true);
  }, [hydrated, setHydrated]);

  const activeLocale = mounted ? locale : defaultLocale;
  const messages = useMemo(() => allMessages[activeLocale], [activeLocale]);

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
