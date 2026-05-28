"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/stores/language-store";

const CACHE_KEY = "mmebel-deepl-cache";

function readCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function writeCache(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    const cache = readCache();
    cache[key] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
}

export function useDynamicTranslate(text: string) {
  const locale = useLanguageStore((s) => s.locale);
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslated("");
      return;
    }

    if (locale === "uz") {
      setTranslated(text);
      return;
    }

    const cacheKey = `ru:${text}`;
    const cached = readCache()[cacheKey];
    if (cached) {
      setTranslated(cached);
      return;
    }

    let cancelled = false;

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang: "RU" }),
    })
      .then((r) => r.json())
      .then((data: { translated?: string }) => {
        if (cancelled) return;
        const result = data.translated ?? text;
        writeCache(cacheKey, result);
        setTranslated(result);
      })
      .catch(() => {
        if (!cancelled) setTranslated(text);
      });

    return () => {
      cancelled = true;
    };
  }, [text, locale]);

  return translated;
}

export function DynamicText({ text }: { text: string }) {
  const translated = useDynamicTranslate(text);
  return translated;
}
