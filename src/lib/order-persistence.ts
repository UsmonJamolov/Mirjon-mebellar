import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ChatThreadState } from "./chat-types";
import type { SketchData } from "./sketch-types";

const STORE_PATH = path.join(process.cwd(), "data", "orders.json");

export type OrderStatus = "yangi" | "jarayonda" | "tugallangan" | "bekor";

const VALID_STATUSES: OrderStatus[] = ["yangi", "jarayonda", "tugallangan", "bekor"];

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
  paymentMethod?: string;
  items: OrderItem[];
  source: "chat" | "manual" | "shop";
  chatRound?: number | null;
  createdAt: string;
}

export type OrderDto = {
  id: string;
  date: string;
  total: number;
  status: string;
  customerName: string;
  customerPhone?: string;
  items?: OrderItem[];
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function sketchItemName(sketch?: SketchData | null) {
  if (!sketch) return "Buyurtma (chat)";
  return `${sketch.type} · ${sketch.length}×${sketch.width}×${sketch.height} sm`;
}

export function estimateSketchTotal(sketch?: SketchData | null) {
  if (!sketch) return 5_000_000;
  const vol = (sketch.length || 100) * (sketch.width || 60) * (sketch.height || 200);
  return Math.max(1_500_000, Math.round(vol * 120));
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

export function toOrderDto(o: StoredOrder): OrderDto {
  return {
    id: o.orderNumber,
    date: o.date,
    total: o.total,
    status: o.status,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    items: o.items,
  };
}

export async function listOrders(params?: {
  status?: string;
  q?: string;
  phone?: string;
}): Promise<OrderDto[]> {
  let orders = await readOrders();
  if (params?.phone) {
    const p = params.phone.replace(/\D/g, "");
    orders = orders.filter(
      (o) => o.customerPhone.replace(/\D/g, "") === p || o.customerPhone === params.phone
    );
  }
  if (params?.status && params.status !== "barchasi") {
    orders = orders.filter((o) => o.status === params.status);
  }
  if (params?.q?.trim()) {
    const q = params.q.trim().toLowerCase();
    orders = orders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        o.orderNumber.includes(q) ||
        o.customerPhone.includes(q)
    );
  }
  return orders
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .map(toOrderDto);
}

export async function createManualOrder(body: {
  customerName: string;
  customerPhone?: string;
  total: number;
  status?: OrderStatus;
  items?: OrderItem[];
}): Promise<OrderDto> {
  const orders = await readOrders();
  const orderNumber = await nextOrderNumber(orders);
  const total = body.total || 0;
  const order: StoredOrder = {
    orderNumber,
    date: today(),
    total,
    status: body.status ?? "yangi",
    customerName: body.customerName || "Mijoz",
    customerPhone: body.customerPhone ?? "",
    items: body.items?.length
      ? body.items
      : [{ name: "Buyurtma", quantity: 1, price: total }],
    source: "manual",
    chatRound: null,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  await writeOrders(orders);
  return toOrderDto(order);
}

export async function patchOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<OrderDto | null> {
  if (!VALID_STATUSES.includes(status)) return null;
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx === -1) return null;
  orders[idx].status = status;
  await writeOrders(orders);
  return toOrderDto(orders[idx]);
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDto | null> {
  const orders = await readOrders();
  const order = orders.find((o) => o.orderNumber === orderNumber);
  return order ? toOrderDto(order) : null;
}

/** Chat kelishuvidan keyin buyurtma yaratish */
export type ReportSummary = {
  totalOrders: number;
  newOrders: number;
  totalIncome: number;
  activeCustomers: number;
  incomeChartData: { day: string; summa: number }[];
  salesByCategory: { name: string; value: number; color: string }[];
  avgCheck: number;
};

export async function buildReportSummary(): Promise<ReportSummary> {
  const orders = await readOrders();
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === "yangi").length;
  const completed = orders.filter((o) => o.status === "tugallangan");
  const totalIncome = completed.reduce((s, o) => s + (o.total || 0), 0);
  const customers = new Set(
    orders.map((o) => o.customerPhone || o.customerName).filter(Boolean)
  );

  const byDay: Record<string, number> = {};
  for (const o of orders) {
    const d = o.date || o.createdAt.slice(0, 10);
    const day = String(parseInt(d.split("-")[2] || "1", 10));
    if (o.status === "tugallangan") {
      byDay[day] = (byDay[day] || 0) + (o.total || 0);
    }
  }
  let incomeChartData = Object.entries(byDay)
    .map(([day, summa]) => ({ day, summa }))
    .sort((a, b) => Number(a.day) - Number(b.day));

  if (incomeChartData.length === 0) {
    incomeChartData = [1, 6, 11, 16, 21, 26].map((day) => ({ day: String(day), summa: 0 }));
  }

  const catMap: Record<string, number> = {};
  for (const o of orders) {
    for (const item of o.items) {
      const key = item.name.split(" ")[0] || "Boshqa";
      catMap[key] = (catMap[key] || 0) + item.quantity;
    }
  }
  const catTotal = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
  const salesByCategory = Object.entries(catMap).map(([name, count], i) => ({
    name,
    value: Math.round((count / catTotal) * 100),
    color: colors[i % colors.length],
  }));

  const avgCheck = completed.length
    ? Math.round(totalIncome / completed.length)
    : 0;

  return {
    totalOrders,
    newOrders,
    totalIncome,
    activeCustomers: customers.size,
    incomeChartData,
    salesByCategory,
    avgCheck,
  };
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
