import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { ChatMessage, ChatOrderStatus, ChatThreadState } from "./chat-types";
import type { SketchData } from "./sketch-types";

const STORE_PATH = path.join(process.cwd(), "..", "data", "chat-store.json");

const DEFAULT_STATE: ChatThreadState = {
  threadId: "main",
  customerName: "Mijoz",
  status: "kelishuv",
  customerAgreed: false,
  adminAgreed: false,
  messages: [
    {
      id: "msg-1",
      sender: "admin",
      text: "Assalomu alaykum! Mebellarga xush kelibsiz. Qanday yordam bera olaman?",
      createdAt: new Date().toISOString(),
    },
  ],
  activeSketch: null,
};

export async function readChatStore(): Promise<ChatThreadState> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as ChatThreadState;
  } catch {
    await writeChatStore(DEFAULT_STATE);
    return DEFAULT_STATE;
  }
}

export async function writeChatStore(state: ChatThreadState): Promise<void> {
  await writeFile(STORE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveStatus(customerAgreed: boolean, adminAgreed: boolean): ChatOrderStatus {
  if (customerAgreed && adminAgreed) return "buyurtma_boshlandi";
  if (customerAgreed) return "mijoz_rozi";
  if (adminAgreed) return "sotuvchi_rozi";
  return "kelishuv";
}

export async function addMessage(
  sender: ChatMessage["sender"],
  payload: { text?: string; sketch?: SketchData }
): Promise<ChatThreadState> {
  const state = await readChatStore();
  const msg: ChatMessage = {
    id: newId("msg"),
    sender,
    text: payload.text,
    sketch: payload.sketch,
    createdAt: new Date().toISOString(),
  };
  state.messages.push(msg);

  if (payload.sketch) {
    state.activeSketch = {
      data: { ...payload.sketch },
      updatedAt: new Date().toISOString(),
      updatedBy: sender,
      version: (state.activeSketch?.version ?? 0) + 1,
    };
  }

  await writeChatStore(state);
  return state;
}

export async function updateActiveSketch(
  sketch: SketchData,
  sender: ChatMessage["sender"]
): Promise<ChatThreadState> {
  const state = await readChatStore();
  state.activeSketch = {
    data: { ...sketch },
    updatedAt: new Date().toISOString(),
    updatedBy: sender,
    version: (state.activeSketch?.version ?? 0) + 1,
  };
  state.messages.push({
    id: newId("msg"),
    sender,
    text: `Eskiz yangilandi (${sender === "customer" ? "mijoz" : "sotuvchi"})`,
    createdAt: new Date().toISOString(),
  });
  await writeChatStore(state);
  return state;
}

export async function setAgreement(sender: ChatMessage["sender"]): Promise<ChatThreadState> {
  const state = await readChatStore();
  if (sender === "customer") state.customerAgreed = true;
  else state.adminAgreed = true;

  state.status = resolveStatus(state.customerAgreed, state.adminAgreed);

  if (state.status === "buyurtma_boshlandi") {
    state.messages.push({
      id: newId("msg"),
      sender: "admin",
      text: "✅ Ikkala tomondan kelishildi. Buyurtma qabul qilindi — ish boshlandi!",
      createdAt: new Date().toISOString(),
    });
  } else {
    const who = sender === "customer" ? "Mijoz" : "Sotuvchi";
    state.messages.push({
      id: newId("msg"),
      sender: "admin",
      text: `${who} ishni boshlashga rozi. Ikkinchi tomondan tasdiq kutilmoqda.`,
      createdAt: new Date().toISOString(),
    });
  }

  await writeChatStore(state);
  return state;
}
