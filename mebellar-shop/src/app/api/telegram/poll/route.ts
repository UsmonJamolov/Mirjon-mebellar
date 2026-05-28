import { NextResponse } from "next/server";
import {
  handleTelegramUpdate,
  type TgUpdate,
} from "@/lib/telegram-handler";
import {
  isTelegramConfigured,
  TELEGRAM_BOT_TOKEN,
} from "@/lib/telegram";
import {
  getLastUpdateId,
  setLastUpdateId,
} from "@/lib/telegram-poll-state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Localhost dev uchun Telegram polling.
 * getUpdates orqali yangi xabarlarni olib, handler'ga uzatadi.
 * Webhook va polling — bir xil mantiq.
 *
 * Bir vaqtning o'zida bir nechta serverdan chaqirish xavfsiz emas
 * (Telegram getUpdates throttling qiladi). Bitta dev server uchun yetadi.
 */

let busy = false;
let webhookCleared = false;

async function ensureNoWebhook() {
  if (webhookCleared) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook?drop_pending_updates=false`,
      { cache: "no-store" }
    );
  } catch (e) {
    console.warn("deleteWebhook failed:", e);
  } finally {
    webhookCleared = true;
  }
}

export async function POST() {
  if (!isTelegramConfigured()) {
    return NextResponse.json({
      ok: false,
      reason: "TELEGRAM_BOT_TOKEN sozlanmagan",
    });
  }

  if (busy) {
    return NextResponse.json({ ok: true, skipped: true });
  }
  busy = true;

  try {
    await ensureNoWebhook();

    const offset = (await getLastUpdateId()) + 1;
    const url = new URL(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
    );
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("timeout", "0");
    url.searchParams.set("limit", "20");
    url.searchParams.set(
      "allowed_updates",
      JSON.stringify(["message"])
    );

    let res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (res.status === 409) {
      webhookCleared = false;
      await ensureNoWebhook();
      res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
      });
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("Telegram getUpdates failed:", res.status, body);
      return NextResponse.json(
        { ok: false, error: `getUpdates ${res.status}` },
        { status: 200 }
      );
    }

    const data = (await res.json()) as {
      ok: boolean;
      result?: TgUpdate[];
    };
    const updates = data.result ?? [];
    let maxId = offset - 1;

    for (const upd of updates) {
      try {
        await handleTelegramUpdate(upd);
      } catch (e) {
        console.error("Update handle error:", e);
      }
      if (upd.update_id > maxId) maxId = upd.update_id;
    }

    if (maxId >= offset) {
      await setLastUpdateId(maxId);
    }

    return NextResponse.json({
      ok: true,
      processed: updates.length,
      lastUpdateId: maxId,
    });
  } catch (e) {
    console.error("Telegram poll error:", e);
    return NextResponse.json({ ok: false, error: "poll failed" });
  } finally {
    busy = false;
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, info: "Telegram polling endpoint" });
}
