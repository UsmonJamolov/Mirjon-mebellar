import { NextResponse } from "next/server";
import {
  getOtpSession,
  OTP_RESEND_LOCK_MS,
  refreshOtpCode,
} from "@/lib/otp-store";
import { isTelegramConfigured, sendOtpToTelegram } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * OTP kodni qayta yuborish.
 * Faqat bot orqali kontakt ulangan sessiya uchun ishlaydi.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { token?: string };
    const token = String(body.token ?? "");
    if (!token) {
      return NextResponse.json({ error: "Token kerak" }, { status: 400 });
    }

    const existing = await getOtpSession(token);
    if (!existing) {
      return NextResponse.json({ error: "Sessiya topilmadi" }, { status: 404 });
    }

    const sinceLastSent = Date.now() - existing.lastSentAt;
    if (sinceLastSent < OTP_RESEND_LOCK_MS) {
      const waitSec = Math.ceil((OTP_RESEND_LOCK_MS - sinceLastSent) / 1000);
      return NextResponse.json(
        { error: `Iltimos, ${waitSec} sekunddan keyin urinib ko'ring` },
        { status: 429 }
      );
    }

    const tgId = existing.telegram?.id;
    if (!tgId) {
      return NextResponse.json(
        {
          error:
            "Avval Telegram botga kirib telefon raqamingizni ulashing",
        },
        { status: 409 }
      );
    }

    const updated = await refreshOtpCode(token);
    if (!updated) {
      return NextResponse.json({ error: "Sessiya topilmadi" }, { status: 404 });
    }

    let sentToTelegram = false;
    if (isTelegramConfigured()) {
      sentToTelegram = await sendOtpToTelegram(
        tgId,
        updated.code,
        updated.telegram?.firstName
      );
    }

    return NextResponse.json({
      ok: true,
      expiresAt: updated.expiresAt,
      lastSentAt: updated.lastSentAt,
      sentToTelegram,
    });
  } catch (e) {
    console.error("OTP resend error:", e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
