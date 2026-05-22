import { chatThreads } from "@/lib/mock-data";
import type { ChatThread } from "@/lib/types";
import type { ChatThreadState } from "@/lib/chat-api";

function timeToIso(timeStr: string): string {
  const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10) || 0);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function mockThreadToState(t: ChatThread): ChatThreadState {
  return {
    threadId: t.id,
    customerName: t.customerName,
    status: "kelishuv",
    customerAgreed: false,
    adminAgreed: false,
    activeSketch: null,
    messages: t.messages.map((m) => ({
      id: `mock-${t.id}-${m.id}`,
      sender: m.sender,
      text: m.text,
      createdAt: timeToIso(m.time),
    })),
  };
}

export function createInitialDemoThreads(): Record<string, ChatThreadState> {
  const out: Record<string, ChatThreadState> = {};
  for (const t of chatThreads) {
    out[t.id] = mockThreadToState(t);
  }
  return out;
}
