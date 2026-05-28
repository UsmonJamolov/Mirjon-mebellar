import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { ChatThreadState } from "./chat-types";
import { estimateSketchTotal, sketchItemName } from "./order-utils";

const STORE_PATH = path.join(process.cwd(), "..", "data", "orders.json");

export type OrderStatus = "yangi" | "jarayonda" | "tugallangan" | "bekor";

export interface OrderItem {
  name: string;
  quantity: number;
  productId?: string;
  price?: number;
}

export interface StoredOrder {
  orderNumber: string;
  date: string;
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  source: "chat" | "manual" | "shop";
  chatRound?: number | null;
  createdAt: string;
}

export type UserOrder = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { name: string; quantity: number }[];
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function readOrders(): Promise<StoredOrder[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: StoredOrder[]): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

async function nextOrderNumber(orders: StoredOrder[]) {
  const nums = orders
    .map((o) => parseInt(o.orderNumber, 10))
    .filter((n) => Number.isFinite(n));
  const n = nums.length ? Math.max(...nums) + 1 : 12579;
  return String(n).slice(-5);
}

function toUserOrder(o: StoredOrder): UserOrder {
  return {
    id: o.orderNumber,
    date: o.date,
    total: o.total,
    status: o.status,
    items: o.items.map((i) => ({ name: i.name, quantity: i.quantity })),
  };
}

export async function listOrdersForCustomer(phone: string): Promise<UserOrder[]> {
  if (!phone.trim()) return [];
  const p = phone.replace(/\D/g, "");
  const orders = await readOrders();
  return orders
    .filter((o) => o.customerPhone.replace(/\D/g, "") === p)
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .map(toUserOrder);
}

export async function createOrderFromChat(
  thread: ChatThreadState
): Promise<StoredOrder | null> {
  const round = thread.orderRound ?? 1;
  const orders = await readOrders();
  const phoneKey = (thread.customerPhone ?? "").replace(/\D/g, "");
  const exists = orders.find(
    (o) =>
      o.source === "chat" &&
      o.chatRound === round &&
      (phoneKey
        ? o.customerPhone.replace(/\D/g, "") === phoneKey
        : o.customerName === thread.customerName)
  );
  if (exists) return exists;

  const sketch = thread.activeSketch?.data;
  const total = estimateSketchTotal(sketch);
  const orderNumber = await nextOrderNumber(orders);

  const order: StoredOrder = {
    orderNumber,
    date: today(),
    total,
    status: "yangi",
    customerName: thread.customerName || "Mijoz",
    customerPhone: thread.customerPhone ?? "",
    items: [
      {
        name: sketchItemName(sketch),
        quantity: 1,
        productId: "chat-sketch",
        price: total,
      },
    ],
    source: "chat",
    chatRound: round,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  await writeOrders(orders);
  return order;
}
