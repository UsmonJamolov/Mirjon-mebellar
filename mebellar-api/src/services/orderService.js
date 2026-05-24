import { Order } from "../models/Order.js";

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function nextOrderNumber() {
  const last = await Order.findOne().sort({ createdAt: -1 });
  const n = last ? parseInt(last.orderNumber, 10) + 1 : 12579;
  return String(Number.isFinite(n) ? n : Date.now()).slice(-5);
}

function sketchItemName(sketch) {
  if (!sketch) return "Buyurtma (chat)";
  return `${sketch.type} · ${sketch.length}×${sketch.width}×${sketch.height} sm`;
}

function estimateTotal(sketch) {
  if (!sketch) return 5_000_000;
  const vol = (sketch.length || 100) * (sketch.width || 60) * (sketch.height || 200);
  return Math.max(1_500_000, Math.round(vol * 120));
}

/** Chat kelishuvidan keyin buyurtma yaratish */
export async function createOrderFromChat(thread) {
  const round = thread.orderRound ?? 1;
  const exists = await Order.findOne({
    customerName: thread.customerName,
    source: "chat",
    chatRound: round,
  });
  if (exists) return exists;

  const sketch = thread.activeSketch?.data;
  const orderNumber = await nextOrderNumber();

  return Order.create({
    orderNumber,
    date: today(),
    total: estimateTotal(sketch),
    status: "yangi",
    customerName: thread.customerName || "Mijoz",
    customerPhone: "",
    customerAddress: "",
    items: [
      {
        name: sketchItemName(sketch),
        quantity: 1,
        productId: "chat-sketch",
        price: estimateTotal(sketch),
      },
    ],
    source: "chat",
    chatRound: round,
  });
}
