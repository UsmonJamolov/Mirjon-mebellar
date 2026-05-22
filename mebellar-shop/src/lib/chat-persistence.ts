import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { ChatMessage, ChatThreadState } from "./chat-types";
import type { SketchData } from "./sketch-types";
import { isOrderStarted } from "./chat-rules";

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
  adminLastSeenAt: null,
  orderRound: 1,
};

export async function readChatStore(): Promise<ChatThreadState> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as ChatThreadState;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      orderRound: parsed.orderRound ?? 1,
    };
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

function resolveStatus(customerAgreed: boolean, adminAgreed: boolean) {
  if (customerAgreed && adminAgreed) return "buyurtma_boshlandi" as const;
  if (customerAgreed) return "mijoz_rozi" as const;
  if (adminAgreed) return "sotuvchi_rozi" as const;
  return "kelishuv" as const;
}

export async function touchAdminPresence(): Promise<ChatThreadState> {
  const state = await readChatStore();
  state.adminLastSeenAt = new Date().toISOString();
  await writeChatStore(state);
  return state;
}

export async function addMessage(
  sender: ChatMessage["sender"],
  payload: { text?: string; sketch?: SketchData }
): Promise<ChatThreadState> {
  const state = await readChatStore();

  if (payload.sketch && sender === "customer" && isOrderStarted(state)) {
    throw new Error("Eskiz qulflangan");
  }

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

  if (sender === "customer" && isOrderStarted(state)) {
    throw new Error("Kelishuvdan keyin mijoz eskizni o'zgartira olmaydi");
  }

  state.activeSketch = {
    data: { ...sketch },
    updatedAt: new Date().toISOString(),
    updatedBy: sender,
    version: (state.activeSketch?.version ?? 0) + 1,
  };

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
      text: "✅ Ikkala tomondan kelishildi. Buyurtma qabul qilindi — eskiz sotuvchi nazoratida.",
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

export async function cancelAgreement(): Promise<ChatThreadState> {
  const state = await readChatStore();
  state.customerAgreed = false;
  state.adminAgreed = false;
  state.status = "kelishuv";
  state.messages.push({
    id: newId("msg"),
    sender: "admin",
    text: "⚠️ Sotuvchi kelishuvni bekor qildi. Eskiz va shartlar qayta muhokama qilinadi.",
    createdAt: new Date().toISOString(),
  });
  await writeChatStore(state);
  return state;
}

export async function startNewOrder(): Promise<ChatThreadState> {
  const state = await readChatStore();
  const round = (state.orderRound ?? 1) + 1;
  state.orderRound = round;
  state.status = "kelishuv";
  state.customerAgreed = false;
  state.adminAgreed = false;
  state.activeSketch = null;
  state.messages.push({
    id: newId("msg"),
    sender: "admin",
    text: `🆕 Yangi buyurtma #${round} — yangi eskiz va ikki tomonlama kelishuv boshlandi.`,
    createdAt: new Date().toISOString(),
  });
  await writeChatStore(state);
  return state;
}
