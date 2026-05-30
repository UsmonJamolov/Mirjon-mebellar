import { NextResponse } from "next/server";
import { signInWithOtp } from "@/lib/mobile-sign-in";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mobil ilova — Telegram OTP orqali JWT olish */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token ?? "").trim();
    const code = String(body.code ?? "").trim();

    if (!token || !code) {
      return NextResponse.json({ error: "Token va kod kerak" }, { status: 400 });
    }

    const result = await signInWithOtp(token, code);
    if (!result) {
      return NextResponse.json(
        { error: "Kod noto'g'ri yoki Telegram ulanmagan" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (e) {
    console.error("Mobile sign-in error:", e);
    return NextResponse.json({ error: "Kirish bajarilmadi" }, { status: 500 });
  }
}
