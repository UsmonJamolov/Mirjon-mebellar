/** Admin (3000) → do'kon API (3001) orqali umumiy chat */

const API = "http://localhost:3001/api/chat";

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
  if (!res.ok) throw new Error("Chat API");
  return res.json();
}

export async function fetchChatThread() {
  const res = await fetch(API, { cache: "no-store" });
  return parse<ChatThreadState>(res);
}

export async function sendChatMessage(sender: ChatSender, payload: { text?: string; sketch?: SketchData }) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "message", sender, ...payload }),
  });
  return parse<ChatThreadState>(res);
}

export async function updateChatSketch(sender: ChatSender, sketch: SketchData) {
  const res = await fetch(API, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "updateSketch", sender, sketch }),
  });
  return parse<ChatThreadState>(res);
}

export async function agreeToStartWork(sender: ChatSender) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "agree", sender }),
  });
  return parse<ChatThreadState>(res);
}
