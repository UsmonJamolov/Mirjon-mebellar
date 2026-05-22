import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:4000";
const EXPRESS_CHAT = `${API_BASE}/api/chat`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function proxyToExpress(req: Request) {
  const url = new URL(req.url);
  const target = `${EXPRESS_CHAT}${url.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const res = await fetch(target, init);
  const body = await res.text();

  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    return await proxyToExpress(req);
  } catch (e) {
    console.error("[chat] Express ulanmadi:", e);
    return NextResponse.json(
      { error: "Chat serveri ishlamayapti (port 4000). mebellar-api ni ishga tushiring." },
      { status: 503, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await proxyToExpress(req);
  } catch (e) {
    console.error("[chat] POST proxy:", e);
    return NextResponse.json(
      { error: "Xabar yuborilmadi — API ulanmadi" },
      { status: 503, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    return await proxyToExpress(req);
  } catch (e) {
    console.error("[chat] PATCH proxy:", e);
    return NextResponse.json(
      { error: "Eskiz saqlanmadi — API ulanmadi" },
      { status: 503, headers: CORS_HEADERS }
    );
  }
}
