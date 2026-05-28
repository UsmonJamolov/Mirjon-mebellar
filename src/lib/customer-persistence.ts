import { listOrders, type OrderDto, type StoredOrder } from "./order-persistence";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "data", "orders.json");

async function readOrdersRaw(): Promise<StoredOrder[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

async function writeOrdersRaw(orders: StoredOrder[]) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export type CustomerDto = {
  id: string;
  name: string;
  phone: string;
  address: string;
  registeredAt: string;
  status: string;
  avatar: string;
  notes: string[];
  orders: OrderDto[];
  lastOrderDate?: string;
};

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";

function customerIdFromKey(key: string) {
  return key.replace(/\s+/g, "-").slice(0, 24) || "mijoz";
}

export async function listCustomers(query?: string): Promise<CustomerDto[]> {
  const orders = await listOrders();
  const map = new Map<string, CustomerDto>();

  for (const o of orders) {
    const key = (o.customerPhone || o.customerName || "unknown").trim();
    if (!map.has(key)) {
      map.set(key, {
        id: customerIdFromKey(key),
        name: o.customerName || "Mijoz",
        phone: o.customerPhone || "—",
        address: "",
        registeredAt: o.date,
        status: "faol",
        avatar: DEFAULT_AVATAR,
        notes: [],
        orders: [],
        lastOrderDate: o.date,
      });
    }
    const c = map.get(key)!;
    c.orders.push(o);
    if (o.date && (!c.lastOrderDate || o.date > c.lastOrderDate)) {
      c.lastOrderDate = o.date;
    }
  }

  let list = Array.from(map.values());
  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) =>
    (b.lastOrderDate || "").localeCompare(a.lastOrderDate || "")
  );
}

export async function deleteCustomerById(
  id: string
): Promise<{ ok: true; deletedOrders: number }> {
  const customers = await listCustomers();
  const customer = customers.find((c) => c.id === id);
  if (!customer) {
    throw new Error("Mijoz topilmadi");
  }

  const orders = await readOrdersRaw();
  const phone = customer.phone && customer.phone !== "—" ? customer.phone : "";
  const before = orders.length;
  const next = orders.filter((o) => {
    if (phone) {
      return o.customerPhone !== phone;
    }
    return o.customerName !== customer.name;
  });

  if (next.length === before) {
    throw new Error("Mijoz topilmadi");
  }

  await writeOrdersRaw(next);

  return { ok: true, deletedOrders: before - next.length };
}
