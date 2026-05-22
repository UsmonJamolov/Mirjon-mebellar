import { ChatThread } from "../models/ChatThread.js";
import { defaultChat } from "../seed-data.js";

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
