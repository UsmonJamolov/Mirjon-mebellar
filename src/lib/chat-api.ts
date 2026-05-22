/** Admin (3000) — mijoz (3001) bilan bir xil Express chat API */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:4000";

function getChatUrl() {
  if (typeof window !== "undefined") {
    return "/api/chat";
  }
  return `${API_BASE}/api/chat`;
}

export type ChatSender = "customer" | "admin";
export type ChatOrderStatus = "kelishuv" | "mijoz_rozi" | "sotuvchi_rozi" | "buyurtma_boshlandi";

export interface SketchData {
  type: string;
  length: number;
  width: number;
  height: number;
  material: string;
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text?: string;
  sketch?: SketchData;
  createdAt: string;
}

export interface ActiveSketch {
  data: SketchData;
  updatedAt: string;
  updatedBy: ChatSender;
  version: number;
}

export interface ChatThreadState {
  threadId: string;
  customerName: string;
  status: ChatOrderStatus;
  customerAgreed: boolean;
  adminAgreed: boolean;
  messages: ChatMessage[];
  activeSketch: ActiveSketch | null;
  adminLastSeenAt?: string | null;
  orderRound?: number;
}

export const CHAT_STATUS_LABELS: Record<ChatOrderStatus, string> = {
  kelishuv: "Kelishuv jarayonida",
  mijoz_rozi: "Mijoz roziligi bildirildi",
  sotuvchi_rozi: "Sotuvchi roziligi bildirildi",
  buyurtma_boshlandi: "Buyurtma qabul qilindi — ish boshlandi",
};

export function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

export function formatSketchSummary(s: SketchData) {
  return `${s.type} · ${s.length}×${s.width}×${s.height} sm · ${s.material}`;
}

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Chat API (${res.status})`);
  }
  return data;
}

export async function fetchChatThread() {
  const res = await fetch(getChatUrl(), { cache: "no-store" });
  return parse<ChatThreadState>(res);
}

export async function sendChatMessage(
  sender: ChatSender,
  payload: { text?: string; sketch?: SketchData; customerName?: string }
) {
  const res = await fetch(getChatUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "message", sender, ...payload }),
  });
  return parse<ChatThreadState>(res);
}

export async function updateChatSketch(sender: ChatSender, sketch: SketchData) {
  const res = await fetch(getChatUrl(), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "updateSketch", sender, sketch }),
  });
  return parse<ChatThreadState>(res);
}

export async function agreeToStartWork(sender: ChatSender) {
  const res = await fetch(getChatUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "agree", sender }),
  });
  return parse<ChatThreadState>(res);
}

export async function sendAdminHeartbeat() {
  const res = await fetch(getChatUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "heartbeat", sender: "admin" }),
  });
  return parse<ChatThreadState>(res);
}

export async function cancelChatAgreement() {
  const res = await fetch(getChatUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "cancelAgreement", sender: "admin" }),
  });
  return parse<ChatThreadState>(res);
}
