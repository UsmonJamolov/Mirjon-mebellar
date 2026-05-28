"use client";

import { useEffect } from "react";

const POLL_MS = 2500;

/**
 * Telegram bot xabarlarini olish (dev).
 * Oldin faqat /auth sahifasida poll qilinar edi — bot boshqa payt javob bermas edi.
 */
export function TelegramPollBridge() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      if (stopped) return;
      try {
        const res = await fetch("/api/telegram/poll", {
          method: "POST",
          cache: "no-store",
        });
        const data = (await res.json().catch(() => ({}))) as {
          mode?: string;
        };
        if (data.mode === "webhook") {
          stopped = true;
          return;
        }
      } catch {
        /* server o'chiq bo'lishi mumkin */
      }
      timer = setTimeout(tick, POLL_MS);
    };

    void tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
