import { ChatThread } from "../models/ChatThread.js";
import { defaultChat } from "../seed-data.js";
import { createOrderFromChat } from "./orderService.js";

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveStatus(customerAgreed, adminAgreed) {
  if (customerAgreed && adminAgreed) return "buyurtma_boshlandi";
  if (customerAgreed) return "mijoz_rozi";
  if (adminAgreed) return "sotuvchi_rozi";
  return "kelishuv";
}

function isOrderStarted(status) {
  return status === "buyurtma_boshlandi";
}

function toState(doc) {
  const o = doc.toObject();
  return {
    threadId: o.threadId,
    customerName: o.customerName,
    status: o.status,
    customerAgreed: o.customerAgreed,
    adminAgreed: o.adminAgreed,
    messages: o.messages,
    activeSketch: o.activeSketch,
    adminLastSeenAt: o.adminLastSeenAt ?? null,
    orderRound: o.orderRound ?? 1,
  };
}

export async function getOrCreateThread() {
  let doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) {
    doc = await ChatThread.create(defaultChat);
  }
  return toState(doc);
}

export async function touchAdminPresence() {
  const doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) return getOrCreateThread();
  doc.adminLastSeenAt = new Date().toISOString();
  await doc.save();
  return toState(doc);
}

export async function addMessage(sender, payload) {
  const doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) return getOrCreateThread().then(() => addMessage(sender, payload));

  if (payload.sketch && sender === "customer" && isOrderStarted(doc.status)) {
    throw new Error("Eskiz qulflangan");
  }

  if (payload.customerName && sender === "customer") {
    doc.customerName = String(payload.customerName).trim() || doc.customerName;
  }

  const msg = {
    id: newId("msg"),
    sender,
    text: payload.text?.trim() || undefined,
    sketch: payload.sketch,
    createdAt: new Date().toISOString(),
  };
  if (!msg.text && !msg.sketch) {
    throw new Error("Xabar matni bo'sh");
  }

  doc.messages.push(msg);

  if (payload.sketch) {
    doc.activeSketch = {
      data: { ...payload.sketch },
      updatedAt: new Date().toISOString(),
      updatedBy: sender,
      version: (doc.activeSketch?.version ?? 0) + 1,
    };
  }

  doc.markModified("messages");
  await doc.save();
  return toState(doc);
}

export async function updateActiveSketch(sketch, sender) {
  const doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) throw new Error("Chat topilmadi");

  if (sender === "customer" && isOrderStarted(doc.status)) {
    throw new Error("Kelishuvdan keyin mijoz eskizni o'zgartira olmaydi");
  }

  doc.activeSketch = {
    data: { ...sketch },
    updatedAt: new Date().toISOString(),
    updatedBy: sender,
    version: (doc.activeSketch?.version ?? 0) + 1,
  };

  await doc.save();
  return toState(doc);
}

export async function setAgreement(sender) {
  const doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) throw new Error("Chat topilmadi");

  if (sender === "customer") doc.customerAgreed = true;
  else doc.adminAgreed = true;

  doc.status = resolveStatus(doc.customerAgreed, doc.adminAgreed);

  if (doc.status === "buyurtma_boshlandi") {
    doc.messages.push({
      id: newId("msg"),
      sender: "admin",
      text: "✅ Ikkala tomondan kelishildi. Buyurtma qabul qilindi — eskiz sotuvchi nazoratida.",
      createdAt: new Date().toISOString(),
    });
    await createOrderFromChat(toState(doc));
  } else {
    const who = sender === "customer" ? "Mijoz" : "Sotuvchi";
    doc.messages.push({
      id: newId("msg"),
      sender: "admin",
      text: `${who} ishni boshlashga rozi. Ikkinchi tomondan tasdiq kutilmoqda.`,
      createdAt: new Date().toISOString(),
    });
  }

  await doc.save();
  return toState(doc);
}

export async function cancelAgreement() {
  const doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) throw new Error("Chat topilmadi");

  doc.customerAgreed = false;
  doc.adminAgreed = false;
  doc.status = "kelishuv";
  doc.messages.push({
    id: newId("msg"),
    sender: "admin",
    text: "⚠️ Sotuvchi kelishuvni bekor qildi. Eskiz va shartlar qayta muhokama qilinadi.",
    createdAt: new Date().toISOString(),
  });

  await doc.save();
  return toState(doc);
}

export async function startNewOrder() {
  const doc = await ChatThread.findOne({ threadId: "main" });
  if (!doc) throw new Error("Chat topilmadi");

  const round = (doc.orderRound ?? 1) + 1;
  doc.orderRound = round;
  doc.status = "kelishuv";
  doc.customerAgreed = false;
  doc.adminAgreed = false;
  doc.activeSketch = null;
  doc.messages.push({
    id: newId("msg"),
    sender: "admin",
    text: `🆕 Yangi buyurtma #${round} — yangi eskiz va ikki tomonlama kelishuv boshlandi.`,
    createdAt: new Date().toISOString(),
  });

  await doc.save();
  return toState(doc);
}

function lastMessagePreview(messages) {
  const last = messages?.[messages.length - 1];
  return last?.text?.slice(0, 80) || "Chat";
}

export async function listThreads() {
  const docs = await ChatThread.find().sort({ updatedAt: -1 });
  return docs.map((doc) => {
    const o = doc.toObject();
    const last = o.messages?.[o.messages.length - 1];
    return {
      id: o.threadId,
      customerName: o.customerName,
      lastMessage: lastMessagePreview(o.messages),
      time: last?.createdAt
        ? new Date(last.createdAt).toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "hozir",
      isLive: o.threadId === "main",
      unread: 0,
    };
  });
}

export async function deleteThread(threadId) {
  if (threadId === "main") {
    throw new Error("Asosiy chatni o'chirib bo'lmaydi");
  }
  const r = await ChatThread.deleteOne({ threadId });
  if (!r.deletedCount) throw new Error("Chat topilmadi");
  return { ok: true };
}

export async function createThread(customerName) {
  const name = String(customerName || "").trim() || "Mijoz";
  const threadId = `t-${Date.now()}`;
  const doc = await ChatThread.create({
    threadId,
    customerName: name,
    status: "kelishuv",
    messages: [
      {
        id: newId("msg"),
        sender: "customer",
        text: "Assalomu alaykum!",
        createdAt: new Date().toISOString(),
      },
    ],
  });
  return {
    id: doc.threadId,
    customerName: doc.customerName,
    lastMessage: "Assalomu alaykum!",
    time: "hozir",
    isLive: false,
    unread: 0,
  };
}
