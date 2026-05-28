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
  customerUserId?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerAvatar?: string;
  customerTelegramUsername?: string;
  status: ChatOrderStatus;
  customerAgreed: boolean;
  adminAgreed: boolean;
  agreedMessageId?: string | null;
  messages: ChatMessage[];
  activeSketch: ActiveSketch | null;
  adminLastSeenAt?: string | null;
  customerLastSeenAt?: string | null;
  orderRound?: number;
  /** Admin chatni tozalaganda — ro'yxatdan yashirin */
  cleared?: boolean;
}

export function getLatestSketchMessageId(messages: ChatMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sketch) return messages[i].id;
  }
  return null;
}

export function isAgreedMessageId(
  messageId: string,
  thread: Pick<ChatThreadState, "customerAgreed" | "agreedMessageId">
): boolean {
  return Boolean(
    thread.customerAgreed && thread.agreedMessageId && messageId === thread.agreedMessageId
  );
}

export function isAgreedSketchMessage(
  message: ChatMessage,
  thread: Pick<ChatThreadState, "customerAgreed" | "agreedMessageId">
): boolean {
  return Boolean(message.sketch && isAgreedMessageId(message.id, thread));
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
