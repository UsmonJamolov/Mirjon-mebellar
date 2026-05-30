/**
 * mebellar-shop/.env.local dagi TELEGRAM_SHOP_URL, NEXTAUTH_URL, AUTH_URL ni yangilaydi.
 * Ishlatish:
 *   node scripts/update-shop-env-url.mjs http://10.181.191.114:3001
 *   node scripts/update-shop-env-url.mjs https://xxx.trycloudflare.com
 */
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(root, "mebellar-shop", ".env.local");

function detectLanUrl() {
  const nets = os.networkInterfaces();
  for (const list of Object.values(nets)) {
    for (const net of list ?? []) {
      if (net.family !== "IPv4" || net.internal) continue;
      if (net.address.startsWith("169.254.")) continue;
      return `http://${net.address}:3001`;
    }
  }
  return "http://localhost:3001";
}

const rawArg = process.argv[2]?.trim();
const base = (rawArg || detectLanUrl()).replace(/\/$/, "");

if (!/^https?:\/\//i.test(base)) {
  console.error("URL http:// yoki https:// bilan boshlanishi kerak");
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  console.error(".env.local topilmadi:", envPath);
  process.exit(1);
}

let text = fs.readFileSync(envPath, "utf8");

function setLine(key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(text)) {
    text = text.replace(re, line);
  } else {
    text = text.trimEnd() + `\n${line}\n`;
  }
}

setLine("TELEGRAM_SHOP_URL", base);
setLine("NEXTAUTH_URL", base);
setLine("AUTH_URL", base);
setLine("NEXT_PUBLIC_APP_URL", base);

fs.writeFileSync(envPath, text, "utf8");
console.log("Yangilandi:", base);
console.log("Do'kon serverni qayta ishga tushiring (Ctrl+C → npm run dev)");
