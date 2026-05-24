import { Router } from "express";
import { Order, toOrderDto } from "../models/Order.js";

export const ordersRouter = Router();

ordersRouter.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.customerName) filter.customerName = req.query.customerName;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.q) {
      const q = String(req.query.q);
      filter.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { customerName: { $regex: q, $options: "i" } },
      ];
    }
    const docs = await Order.find(filter).sort({ createdAt: -1 });
    res.json(docs.map(toOrderDto));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Buyurtmalarni yuklashda xato" });
  }
});

ordersRouter.get("/:id", async (req, res) => {
  try {
    const doc = await Order.findOne({ orderNumber: req.params.id });
    if (!doc) return res.status(404).json({ error: "Buyurtma topilmadi" });
    res.json(toOrderDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Buyurtma yuklashda xato" });
  }
});

ordersRouter.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, total, status } = req.body;
    const last = await Order.findOne().sort({ createdAt: -1 });
    const n = last ? parseInt(last.orderNumber, 10) + 1 : 12579;
    const orderNumber = String(Number.isFinite(n) ? n : Date.now()).slice(-5);
    const doc = await Order.create({
      orderNumber,
      date: new Date().toISOString().slice(0, 10),
      total: total ?? 0,
      status: status || "yangi",
      customerName: customerName ?? "Mijoz",
      customerPhone,
      customerAddress,
      items: items ?? [],
      source: "manual",
    });
    res.status(201).json(toOrderDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Buyurtma yaratishda xato" });
  }
});

ordersRouter.patch("/:id", async (req, res) => {
  try {
    const doc = await Order.findOne({ orderNumber: req.params.id });
    if (!doc) return res.status(404).json({ error: "Buyurtma topilmadi" });
    const fields = ["status", "customerName", "customerPhone", "customerAddress", "total", "items", "date"];
    for (const f of fields) {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    }
    await doc.save();
    res.json(toOrderDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Yangilashda xato" });
  }
});
