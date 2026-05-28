import { NextResponse } from "next/server";
import {
  getShopPublicUrl,
  isTelegramConfigured,
  TELEGRAM_BOT_TOKEN,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tunnel/production URL ga webhook ulash — brauzer yopiq bo'lsa ham bot ishlaydi */
export async function POST() {
  if (!isTelegramConfigured()) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN yo'q" },
      { status: 400 }
    );
  }

  const base = getShopPublicUrl();
  if (!base) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "TELEGRAM_SHOP_URL sozlanmagan (tunnel havolasi). .env.local ga qo'shing.",
      },
      { status: 400 }
    );
  }

  const webhookUrl = `${base}/api/telegram/webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
        drop_pending_updates: false,
      }),
    }
  );

  const data = (await res.json()) as { ok?: boolean; description?: string };

  if (!res.ok || !data.ok) {
    return NextResponse.json(
      { ok: false, error: data.description ?? "setWebhook failed", webhookUrl },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, webhookUrl });
}

export async function GET() {
  if (!isTelegramConfigured()) {
    return NextResponse.json({ ok: false, configured: false });
  }

  const infoRes = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`,
    { cache: "no-store" }
  );
  const info = await infoRes.json();
  return NextResponse.json({
    ok: true,
    shopUrl: getShopPublicUrl(),
    webhook: info.result ?? null,
  });
}
