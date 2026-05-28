import { readFile } from "fs/promises";
import path from "path";

type OrderItem = { productId?: string; quantity?: number };
type StoredOrder = {
  status: string;
  items: OrderItem[];
};

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

/** Shop loyiha rootdan bir daraja yuqorida */
const SHOP_ORDERS_PATH = path.join(process.cwd(), "..", "data", "orders.json");

async function readOrdersFile(filePath: string): Promise<StoredOrder[]> {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

export async function getProductSalesMap(): Promise<Map<string, number>> {
  let orders = await readOrdersFile(ORDERS_PATH);
  if (!orders.length) {
    orders = await readOrdersFile(SHOP_ORDERS_PATH);
  }

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

export function pickBestsellerProducts<T extends { id: string; isPopular?: boolean; hideFromPopular?: boolean }>(
  products: T[],
  salesMap: Map<string, number>,
  limit = 4
): T[] {
  const visible = products.filter((p) => !p.hideFromPopular);

  const ranked = visible
    .map((p) => ({ p, sold: salesMap.get(p.id) ?? 0 }))
    .sort((a, b) => {
      if (b.sold !== a.sold) return b.sold - a.sold;
      if (a.p.isPopular && !b.p.isPopular) return -1;
      if (!a.p.isPopular && b.p.isPopular) return 1;
      return 0;
    });

  const withSales = ranked.filter((x) => x.sold > 0).map((x) => x.p);
  const picked: T[] = [];
  const seen = new Set<string>();

  for (const p of withSales) {
    if (picked.length >= limit) break;
    picked.push(p);
    seen.add(p.id);
  }

  if (picked.length < limit) {
    const popularFirst = ranked.filter((x) => x.p.isPopular);
    for (const { p } of popularFirst) {
      if (picked.length >= limit) break;
      if (seen.has(p.id)) continue;
      picked.push(p);
      seen.add(p.id);
    }
  }

  if (picked.length < limit) {
    for (const { p } of ranked) {
      if (picked.length >= limit) break;
      if (!seen.has(p.id)) {
        picked.push(p);
        seen.add(p.id);
      }
    }
  }

  return picked;
}
