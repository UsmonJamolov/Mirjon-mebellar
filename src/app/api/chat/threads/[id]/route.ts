import { NextRequest, NextResponse } from "next/server";
import { deleteChatThread } from "@/lib/chat-persistence";
import type { ChatThreadState } from "@/lib/chat-types";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteChatThread(id);
    if ("threadId" in result) {
      return NextResponse.json(result as ChatThreadState);
    }
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "O'chirib bo'lmadi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
