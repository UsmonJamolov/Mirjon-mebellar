/** Bir martalik: chat-store.json ga MongoDB dan mijoz ismini yozadi */
import fs from "fs";
import mongoose from "mongoose";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv(".env");
loadEnv(".env.local");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI yo'q");
  process.exit(1);
}

const storePath = new URL("../data/chat-store.json", import.meta.url);

function splitFullName(full) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

await mongoose.connect(uri);
const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
const hasCustomer = store.messages?.some((m) => m.sender === "customer");
if (!hasCustomer) {
  console.log("Mijoz xabari yo'q");
  process.exit(0);
}

let user = null;
if (store.customerUserId) {
  user = await mongoose.connection.db
    .collection("users")
    .findOne({ _id: new mongoose.Types.ObjectId(store.customerUserId) });
}

if (!user) {
  const withTg = await mongoose.connection.db
    .collection("users")
    .find({ role: "customer", telegramId: { $exists: true, $ne: "" } })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();
  user = withTg[0] ?? null;
}

if (!user) {
  console.error("Mijoz topilmadi");
  process.exit(1);
}

const { firstName, lastName } = splitFullName(user.name ?? "");
store.customerUserId = user._id.toString();
store.customerFirstName = firstName;
store.customerLastName = lastName;
store.customerName = [firstName, lastName].filter(Boolean).join(" ").trim() || user.name;
store.customerPhone = store.customerPhone || user.phone || "";
store.customerTelegramUsername =
  store.customerTelegramUsername || user.telegramUsername || "";

fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log("Saqlandi:", store.customerName);
await mongoose.disconnect();
