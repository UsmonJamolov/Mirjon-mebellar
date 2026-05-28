import { NextResponse } from "next/server";
import { createOtpSession } from "@/lib/otp-store";
import {
  botStartUrl,
  isTelegramConfigured,
  TELEGRAM_BOT_USERNAME,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * OTP sessiya ochish.
 *
 * Saytda telefon raqam KIRITILMAYDI.
 * Sessiya bo'sh ochiladi, faqat token va bot deep link qaytadi.
 * Foydalanuvchi botga o'tib kontaktini ulashganda telefon + chatId
 * sessiyaga biriktiriladi va OTP kod faqat o'sha paytda yuboriladi.
 */
export async function POST() {
  try {
    const session = await createOtpSession();
    const telegramConfigured = isTelegramConfigured();

    if (!telegramConfigured) {
      console.info(
        `[OTP] Telegram bot sozlanmagan — sessiya: ${session.token}, kod: ${session.code}`
      );
    }

    return NextResponse.json({
      ok: true,
      token: session.token,
      botUsername: TELEGRAM_BOT_USERNAME,
      botUrl: botStartUrl(session.token),
      expiresAt: session.expiresAt,
      lastSentAt: session.lastSentAt,
      ttlMs: session.expiresAt - session.createdAt,
      telegramConfigured,
    });
  } catch (e) {
    console.error("OTP start error:", e);
    return NextResponse.json(
      { error: "Sessiya ochib bo'lmadi" },
      { status: 500 }
    );
  }
}
