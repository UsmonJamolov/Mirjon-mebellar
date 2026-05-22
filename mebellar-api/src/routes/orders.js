import { Router } from "express";
import { Order, toOrderDto } from "../models/Order.js";

export const ordersRouter = Router();

ordersRouter.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.customerName) filter.customerName = req.query.customerName;
    const docs = await Order.find(filter).sort({ createdAt: -1 });
    res.json(docs.map(toOrderDto));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Buyurtmalarni yuklashda xato" });
  }
});

ordersRouter.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, total } = req.body;
    const orderNumber = String(Date.now()).slice(-5);
    const doc = await Order.create({
      orderNumber,
      date: new Date().toISOString().slice(0, 10),
      total: total ?? 0,
      status: "yangi",
      customerName: customerName ?? "Mijoz",
      customerPhone,
      customerAddress,
      items: items ?? [],
    });
    res.status(201).json(toOrderDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Buyurtma yaratishda xato" });
  }
});
