import { NextResponse } from "next/server";
import { handleTelegramUpdate, type TgUpdate } from "@/lib/telegram-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Telegram bot webhook.
 * Sozlash:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR_DOMAIN/api/telegram/webhook"
 */
export async function POST(req: Request) {
  try {
    const update = (await req.json()) as TgUpdate;
    await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, info: "Telegram webhook endpoint" });
}
