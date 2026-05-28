import { NextResponse } from "next/server";
import { getOtpSession } from "@/lib/otp-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const s = await getOtpSession(token);
  if (!s) {
    return NextResponse.json(
      { ok: false, state: "missing" },
      { status: 404 }
    );
  }
  return NextResponse.json({
    ok: true,
    state: s.state,
    expiresAt: s.expiresAt,
    lastSentAt: s.lastSentAt,
    hasTelegram: Boolean(s.telegram?.id),
    telegramName: s.telegram?.firstName ?? "",
    phone: s.phone ?? "",
  });
}
