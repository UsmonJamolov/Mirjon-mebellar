import { NextResponse } from "next/server";
import { listChatThreads } from "@/lib/chat-persistence";
import { enrichChatThreads } from "@/lib/enrich-chat-thread";

export async function GET() {
  try {
    const threads = await enrichChatThreads(await listChatThreads());
    return NextResponse.json(threads);
  } catch (e) {
    console.error("[chat/threads] GET error:", e);
    return NextResponse.json({ error: "Chat ro'yxati yuklanmadi" }, { status: 500 });
  }
}
