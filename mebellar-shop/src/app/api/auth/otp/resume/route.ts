import { NextResponse } from "next/server";
import { getOtpSession } from "@/lib/otp-store";
import {
  botStartUrl,
  isTelegramConfigured,
  TELEGRAM_BOT_USERNAME,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mavjud OTP sessiyani davom ettirish (sahifa yangilanganda yoki botdan /auth?token=) */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token")?.trim() ?? "";
  const s = await getOtpSession(token);
  if (!s || s.state === "expired") {
    return NextResponse.json(
      { ok: false, state: s?.state ?? "missing" },
      { status: 404 }
    );
  }

  const telegramConfigured = isTelegramConfigured();
  const tg = s.telegram;

  return NextResponse.json({
    ok: true,
    token: s.token,
    botUsername: TELEGRAM_BOT_USERNAME,
    botUrl: botStartUrl(s.token),
    expiresAt: s.expiresAt,
    lastSentAt: s.lastSentAt,
    ttlMs: s.expiresAt - s.createdAt,
    telegramConfigured,
    state: s.state,
    hasTelegram: Boolean(tg?.id),
    telegramName:
      [tg?.firstName, tg?.lastName].filter(Boolean).join(" ").trim() ||
      tg?.username ||
      "",
    phone: tg?.phone ?? s.phone ?? "",
  });
}
