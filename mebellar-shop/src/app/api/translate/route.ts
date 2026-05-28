import { NextRequest, NextResponse } from "next/server";
import { translateWithDeepL } from "@/lib/deepl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const memoryCache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = String(body.text ?? "").trim();
    const targetLang = body.targetLang === "UZ" ? "UZ" : "RU";

    if (!text) {
      return NextResponse.json({ error: "text kerak" }, { status: 400 });
    }

    const cacheKey = `${targetLang}:${text}`;
    if (memoryCache.has(cacheKey)) {
      return NextResponse.json({
        translated: memoryCache.get(cacheKey),
        cached: true,
      });
    }

    if (!process.env.DEEPL_API_KEY?.trim()) {
      return NextResponse.json({ translated: text, fallback: true });
    }

    const [translated] = await translateWithDeepL([text], targetLang);
    memoryCache.set(cacheKey, translated);

    return NextResponse.json({ translated, cached: false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Tarjima xatosi" }, { status: 500 });
  }
}
