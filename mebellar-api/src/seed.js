import "dotenv/config";
import { connectDb } from "./db.js";
import { Product } from "./models/Product.js";
import { Category } from "./models/Category.js";
import { Order } from "./models/Order.js";
import { ChatThread } from "./models/ChatThread.js";
import { categories, products, userOrders, defaultChat } from "./seed-data.js";

async function seed() {
  await connectDb();

  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await ChatThread.deleteMany({});

  await Category.insertMany(categories);
  await Product.insertMany(products);
  await Order.insertMany(userOrders);
  await ChatThread.create(defaultChat);

  console.log("Seed tugadi:");
  console.log(`  Kategoriyalar: ${categories.length}`);
  console.log(`  Mahsulotlar: ${products.length}`);
  console.log(`  Buyurtmalar: ${userOrders.length}`);
  console.log("  Chat: main thread");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
