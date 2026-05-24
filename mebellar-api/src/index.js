import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb, dbState } from "./db.js";
import { healthRouter } from "./routes/health.js";
import { productsRouter } from "./routes/products.js";
import { categoriesRouter } from "./routes/categories.js";
import { ordersRouter } from "./routes/orders.js";
import { chatRouter } from "./routes/chat.js";
import { customersRouter } from "./routes/customers.js";
import { inventoryRouter } from "./routes/inventory.js";
import { settingsRouter } from "./routes/settings.js";
import { reportsRouter } from "./routes/reports.js";
import { sketchesRouter } from "./routes/sketches.js";
import { Product } from "./models/Product.js";
import { categories, products, userOrders, defaultChat } from "./seed-data.js";
import { Category } from "./models/Category.js";
import { Order } from "./models/Order.js";
import { ChatThread } from "./models/ChatThread.js";
import { Inventory } from "./models/Inventory.js";
import { getSettingsDoc } from "./models/Settings.js";

const PORT = Number(process.env.PORT) || 4000;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "2mb" }));

app.use("/api", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/chat", chatRouter);
app.use("/api/customers", customersRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/sketches", sketchesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server xatosi" });
});

async function autoSeedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  console.log("Baza bo'sh — avtomatik seed...");
  await Category.insertMany(categories);
  await Product.insertMany(products);
  await Order.insertMany(userOrders);
  await ChatThread.create(defaultChat);
  await getSettingsDoc();
  const invSeed = [
    { externalId: "inv-1", name: "MDF 18mm", category: "Material", quantity: 45, unit: "List", status: "yetarli" },
    { externalId: "inv-2", name: "MDF 16mm", category: "Material", quantity: 8, unit: "List", status: "kam" },
    { externalId: "inv-3", name: "Laminat oq", category: "Material", quantity: 120, unit: "m²", status: "yetarli" },
    { externalId: "inv-4", name: "Tortish mexanizmi", category: "Aksessuar", quantity: 34, unit: "Dona", status: "yetarli" },
    { externalId: "inv-5", name: "Ruchka metall", category: "Aksessuar", quantity: 5, unit: "Dona", status: "kam" },
  ];
  await Inventory.insertMany(invSeed);
  console.log("Seed bajarildi.");
}

async function start() {
  await connectDb();
  await autoSeedIfEmpty();

  app.listen(PORT, () => {
    const db = dbState();
    console.log(`Mebellar API: http://localhost:${PORT}`);
    console.log(`MongoDB: ${db.db} (${db.state})`);
    console.log("  GET  /api/health");
    console.log("  GET  /api/products");
    console.log("  GET  /api/categories");
    console.log("  GET  /api/orders");
    console.log("  GET  /api/chat");
  });
}

start().catch((e) => {
  console.error("Server ishga tushmadi:", e.message);
  process.exit(1);
});
