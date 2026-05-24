import { Router } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const reportsRouter = Router();

reportsRouter.get("/summary", async (_req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const newOrders = orders.filter((o) => o.status === "yangi").length;
    const totalIncome = orders
      .filter((o) => o.status === "tugallangan")
      .reduce((s, o) => s + (o.total || 0), 0);
    const customers = new Set(orders.map((o) => o.customerName).filter(Boolean));

    const byDay = {};
    for (const o of orders) {
      const d = o.date || o.createdAt?.toISOString?.()?.slice(0, 10) || "1";
      const day = String(parseInt(d.split("-")[2] || "1", 10));
      byDay[day] = (byDay[day] || 0) + (o.status === "tugallangan" ? o.total || 0 : 0);
    }
    const incomeChartData = Object.entries(byDay)
      .map(([day, summa]) => ({ day, summa }))
      .sort((a, b) => Number(a.day) - Number(b.day));

    if (incomeChartData.length === 0) {
      for (let i = 1; i <= 30; i += 5) incomeChartData.push({ day: String(i), summa: 0 });
    }

    const catMap = {};
    const products = await Product.find();
    for (const p of products) {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    }
    const total = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    const salesByCategory = Object.entries(catMap).map(([name, count], i) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[i % colors.length],
    }));

    const avgCheck = totalOrders ? Math.round(totalIncome / Math.max(1, orders.filter((o) => o.status === "tugallangan").length)) : 0;

    res.json({
      totalOrders,
      newOrders,
      totalIncome,
      activeCustomers: customers.size,
      incomeChartData,
      salesByCategory,
      avgCheck,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Hisobot yuklashda xato" });
  }
});
