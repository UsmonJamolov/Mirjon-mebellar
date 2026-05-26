import type { ChatSender, ChatThreadState } from "./chat-types";
import type { SketchData } from "./sketch-types";

/** Brauzer: /api/chat → Express. Server: to'g'ridan-to'g'ri Express */
export function getChatApiBase() {
  if (typeof window !== "undefined") {
    return "/api/chat";
  }
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:4000";
  return `${base}/api/chat`;
}

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Chat API (${res.status})`);
  }
  return data;
}

export async function fetchChatThread(): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), { cache: "no-store" });
  return parse(res);
}

export async function sendChatMessage(
  sender: ChatSender,
  payload: {
    text?: string;
    sketch?: SketchData;
    customerName?: string;
    customerPhone?: string;
  }
): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "message", sender, ...payload }),
  });
  return parse(res);
}

export async function updateChatSketch(
  sender: ChatSender,
  sketch: SketchData
): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "updateSketch", sender, sketch }),
  });
  return parse(res);
}

export async function agreeToStartWork(
  sender: ChatSender,
  messageId?: string,
  customer?: { customerName?: string; customerPhone?: string }
): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "agree",
      sender,
      messageId,
      customerName: customer?.customerName,
      customerPhone: customer?.customerPhone,
    }),
  });
  return parse(res);
}

export async function sendChatHeartbeat(sender: ChatSender): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "heartbeat", sender }),
  });
  return parse(res);
}

export async function sendAdminHeartbeat(): Promise<ChatThreadState> {
  return sendChatHeartbeat("admin");
}

export async function sendCustomerHeartbeat(): Promise<ChatThreadState> {
  return sendChatHeartbeat("customer");
}

export async function cancelChatAgreement(): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "cancelAgreement", sender: "admin" }),
  });
  return parse(res);
}

export async function deleteChatMessage(
  sender: ChatSender,
  messageId: string
): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "deleteMessage", sender, messageId }),
  });
  return parse(res);
}

export async function startNewChatOrder(): Promise<ChatThreadState> {
  const res = await fetch(getChatApiBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "newOrder", sender: "customer" }),
  });
  return parse(res);
}
