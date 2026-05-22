import type { SketchData } from "./sketch-types";

export type ChatSender = "customer" | "admin";

export type ChatOrderStatus =
  | "kelishuv"
  | "mijoz_rozi"
  | "sotuvchi_rozi"
  | "buyurtma_boshlandi";

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

export function formatMessageTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
