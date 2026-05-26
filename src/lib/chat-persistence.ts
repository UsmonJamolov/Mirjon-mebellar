import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { ChatMessage, ChatThreadState } from "./chat-types";
import { formatMessageTime, getLatestSketchMessageId } from "./chat-types";
import type { SketchData } from "./sketch-types";
import { isOrderStarted } from "./chat-rules";
import { createOrderFromChat } from "./order-persistence";

const STORE_PATH = path.join(process.cwd(), "data", "chat-store.json");

const DEFAULT_STATE: ChatThreadState = {
  threadId: "main",
  customerName: "Mijoz",
  customerPhone: "",
  status: "kelishuv",
  customerAgreed: false,
  adminAgreed: false,
  agreedMessageId: null,
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
  customerLastSeenAt: null,
  orderRound: 1,
};

export async function readChatStore(): Promise<ChatThreadState> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as ChatThreadState;
    const merged = {
      ...DEFAULT_STATE,
      ...parsed,
      orderRound: parsed.orderRound ?? 1,
      agreedMessageId: parsed.agreedMessageId ?? null,
    };
    if (merged.customerAgreed && !merged.agreedMessageId) {
      merged.agreedMessageId = getLatestSketchMessageId(merged.messages);
    }
    return merged;
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

function applyCustomerMeta(
  state: ChatThreadState,
  meta?: { customerName?: string; customerPhone?: string }
) {
  if (meta?.customerName?.trim()) {
    state.customerName = meta.customerName.trim();
  }
  if (meta?.customerPhone?.trim()) {
    state.customerPhone = meta.customerPhone.trim();
  }
}

export async function touchAdminPresence(): Promise<ChatThreadState> {
  const state = await readChatStore();
  state.adminLastSeenAt = new Date().toISOString();
  await writeChatStore(state);
  return state;
}

export async function touchCustomerPresence(): Promise<ChatThreadState> {
  const state = await readChatStore();
  state.customerLastSeenAt = new Date().toISOString();
  await writeChatStore(state);
  return state;
}

export async function addMessage(
  sender: ChatMessage["sender"],
  payload: {
    text?: string;
    sketch?: SketchData;
    customerName?: string;
    customerPhone?: string;
  }
): Promise<ChatThreadState> {
  const state = await readChatStore();
  if (sender === "customer") {
    applyCustomerMeta(state, payload);
  }

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

export async function setAgreement(
  sender: ChatMessage["sender"],
  messageId?: string | null,
  meta?: { customerName?: string; customerPhone?: string }
): Promise<ChatThreadState> {
  const state = await readChatStore();
  const sketchMessageId = messageId ?? getLatestSketchMessageId(state.messages);

  if (sender === "customer") {
    applyCustomerMeta(state, meta);
    state.customerAgreed = true;
    if (sketchMessageId) state.agreedMessageId = sketchMessageId;
  } else {
    state.adminAgreed = true;
    if (!state.agreedMessageId && sketchMessageId) {
      state.agreedMessageId = sketchMessageId;
    }
  }

  state.status = resolveStatus(state.customerAgreed, state.adminAgreed);

  if (state.status === "buyurtma_boshlandi") {
    state.messages.push({
      id: newId("msg"),
      sender: "admin",
      text: "✅ Ikkala tomondan kelishildi. Buyurtma qabul qilindi — eskiz sotuvchi nazoratida.",
      createdAt: new Date().toISOString(),
    });
    await createOrderFromChat(state);
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
  state.agreedMessageId = null;
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

export async function deleteMessage(
  messageId: string,
  sender: ChatMessage["sender"]
): Promise<ChatThreadState> {
  const state = await readChatStore();
  const idx = state.messages.findIndex((m) => m.id === messageId);
  if (idx === -1) throw new Error("Xabar topilmadi");

  const msg = state.messages[idx];
  if (msg.sender !== sender) throw new Error("Faqat o'z xabaringizni o'chira olasiz");
  if (!msg.sketch) throw new Error("Faqat eskiz xabarlarini o'chirish mumkin");

  if (sender === "customer" && isOrderStarted(state)) {
    throw new Error("Buyurtma boshlangach eskizni o'chirib bo'lmaydi");
  }

  if (state.agreedMessageId === messageId && state.customerAgreed) {
    throw new Error("Rozilik berilgan eskizni o'chirib bo'lmaydi");
  }

  state.messages.splice(idx, 1);

  const latestSketchId = getLatestSketchMessageId(state.messages);
  if (latestSketchId) {
    const latest = state.messages.find((m) => m.id === latestSketchId);
    if (latest?.sketch) {
      state.activeSketch = {
        data: { ...latest.sketch },
        updatedAt: new Date().toISOString(),
        updatedBy: latest.sender,
        version: (state.activeSketch?.version ?? 0) + 1,
      };
    }
  } else {
    state.activeSketch = null;
  }

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
  state.agreedMessageId = null;
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

export async function listChatThreads() {
  const state = await readChatStore();
  const last = state.messages[state.messages.length - 1];
  return [
    {
      id: state.threadId,
      customerName: state.customerName,
      lastMessage: last?.text?.slice(0, 80) || "Chat",
      time: last ? formatMessageTime(last.createdAt) : "hozir",
      isLive: true,
      unread: 0,
    },
  ];
}

export async function resetMainChat(): Promise<ChatThreadState> {
  const state: ChatThreadState = {
    ...DEFAULT_STATE,
    messages: DEFAULT_STATE.messages.map((m) => ({ ...m })),
    activeSketch: null,
    adminLastSeenAt: null,
    customerLastSeenAt: null,
    agreedMessageId: null,
    orderRound: 1,
  };
  await writeChatStore(state);
  return state;
}

export async function deleteChatThread(
  threadId: string
): Promise<ChatThreadState | { ok: true }> {
  if (threadId === "main") {
    return resetMainChat();
  }
  return { ok: true };
}
