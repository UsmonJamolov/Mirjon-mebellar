import { NextResponse } from "next/server";
import { listChatThreads } from "@/lib/chat-persistence";

export async function GET() {
  try {
    const threads = await listChatThreads();
    return NextResponse.json(threads);
  } catch (e) {
    console.error("[chat/threads] GET error:", e);
    return NextResponse.json({ error: "Chat ro'yxati yuklanmadi" }, { status: 500 });
  }
}
