import type { ChatSender, ChatThreadState } from "./chat-types";
import type { SketchData } from "./sketch-types";

const API = "/api/chat";

/** Admin panel (3000) uchun to'liq URL */
export function getChatApiBase(role: "shop" | "admin") {
  if (role === "admin" && typeof window !== "undefined") {
    return "http://localhost:3001/api/chat";
  }
  return API;
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error("Chat API xatosi");
  return res.json() as Promise<T>;
}

export async function fetchChatThread(base = API): Promise<ChatThreadState> {
  const res = await fetch(base, { cache: "no-store" });
  return parse(res);
}

export async function sendChatMessage(
  sender: ChatSender,
  payload: { text?: string; sketch?: SketchData },
  base = API
): Promise<ChatThreadState> {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "message", sender, ...payload }),
  });
  return parse(res);
}

export async function updateChatSketch(
  sender: ChatSender,
  sketch: SketchData,
  base = API
): Promise<ChatThreadState> {
  const res = await fetch(base, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "updateSketch", sender, sketch }),
  });
  return parse(res);
}

export async function agreeToStartWork(
  sender: ChatSender,
  base = API
): Promise<ChatThreadState> {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "agree", sender }),
  });
  return parse(res);
}
