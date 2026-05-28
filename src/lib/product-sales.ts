import { readFile } from "fs/promises";
import path from "path";

type OrderItem = { productId?: string; quantity?: number };
type StoredOrder = {
  status: string;
  items: OrderItem[];
};

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

async function readOrdersFile(filePath: string): Promise<StoredOrder[]> {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

export async function getProductSalesMap(): Promise<Map<string, number>> {
  const orders = await readOrdersFile(ORDERS_PATH);
  const map = new Map<string, number>();

  for (const order of orders) {
    if (order.status === "bekor") continue;
    for (const item of order.items ?? []) {
      const id = item.productId?.trim();
      if (!id) continue;
      const qty = Math.max(1, Number(item.quantity) || 1);
      map.set(id, (map.get(id) ?? 0) + qty);
    }
  }
  return map;
}

export function getSalesCount(map: Map<string, number>, productId: string): number {
  return map.get(productId) ?? 0;
}
