import { Router } from "express";
import { Order } from "../models/Order.js";

export const customersRouter = Router();

function customerIdFromOrder(o) {
  const key = o.customerPhone || o.customerName || "unknown";
  return key.replace(/\s+/g, "-").slice(0, 24);
}

async function buildCustomerList(query) {
  const orders = await Order.find().sort({ createdAt: -1 });
  const map = new Map();

  for (const o of orders) {
    const key = o.customerPhone || o.customerName || "unknown";
    if (!map.has(key)) {
      map.set(key, {
        id: customerIdFromOrder(o),
        name: o.customerName || "Mijoz",
        phone: o.customerPhone || "—",
        address: o.customerAddress || "",
        registeredAt: o.createdAt?.toISOString?.()?.slice(0, 10) || o.date,
        status: "faol",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        notes: [],
        orders: [],
        lastOrderDate: o.date,
      });
    }
    const c = map.get(key);
    c.orders.push({
      id: o.orderNumber,
      customerName: o.customerName,
      date: o.date,
      total: o.total,
      status: o.status,
    });
    if (o.date && (!c.lastOrderDate || o.date > c.lastOrderDate)) {
      c.lastOrderDate = o.date;
    }
  }

  let list = Array.from(map.values());
  if (query) {
    const q = String(query).toLowerCase();
    list = list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }
  list.sort((a, b) => (b.lastOrderDate || "").localeCompare(a.lastOrderDate || ""));
  return list;
}

customersRouter.get("/", async (req, res) => {
  try {
    res.json(await buildCustomerList(req.query.q));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Mijozlar yuklashda xato" });
  }
});

customersRouter.delete("/:id", async (req, res) => {
  try {
    const list = await buildCustomerList();
    const customer = list.find((c) => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Mijoz topilmadi" });
    }

    const filter =
      customer.phone && customer.phone !== "—"
        ? { customerPhone: customer.phone }
        : { customerName: customer.name };

    const result = await Order.deleteMany(filter);
    res.json({ ok: true, deletedOrders: result.deletedCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Mijozni o'chirishda xato" });
  }
});
