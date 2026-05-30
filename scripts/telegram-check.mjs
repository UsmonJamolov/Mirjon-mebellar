/**
 * Telegram bot holatini tekshirish.
 * cd mebellar-shop && npm run telegram:check
 */
const SHOP = process.env.SHOP_URL?.replace(/\/$/, "") || "http://localhost:3001";

function ok(label, pass, detail = "") {
  const icon = pass ? "OK" : "XATO";
  console.log(`[${icon}] ${label}${detail ? ` — ${detail}` : ""}`);
  return pass;
}

console.log("\n=== Mebellar Telegram bot tekshiruvi ===\n");

let shopUp = false;
try {
  const r = await fetch(`${SHOP}/api/telegram/poll`, { method: "GET" });
  shopUp = r.ok;
  ok("Do'kon serveri (:3001)", shopUp, SHOP);
} catch (e) {
  ok("Do'kon serveri (:3001)", false, e.message);
}

let pollResult = null;
try {
  const r = await fetch(`${SHOP}/api/telegram/poll`, { method: "POST" });
  pollResult = await r.json();
  const pollOk =
    pollResult.ok &&
    !pollResult.error &&
    pollResult.mode !== "webhook" &&
    !pollResult.skipped;
  ok(
    "Bot polling (getUpdates)",
    pollOk || pollResult.processed >= 0,
    pollResult.error ||
      pollResult.mode ||
      (pollResult.skipped ? "band (boshqa poll ishlayapti)" : `processed=${pollResult.processed ?? 0}`)
  );
} catch (e) {
  ok("Bot polling", false, e.message);
}

let tgApi = false;
try {
  const r = await fetch("https://api.telegram.org", {
    signal: AbortSignal.timeout(8000),
  });
  tgApi = r.status > 0;
  ok("Telegram API (api.telegram.org)", tgApi, `HTTP ${r.status}`);
} catch (e) {
  ok("Telegram API (api.telegram.org)", false, "bloklangan yoki internet yo'q — VPN kerak");
}

let webhookInfo = null;
try {
  const r = await fetch(`${SHOP}/api/telegram/set-webhook`, { method: "GET" });
  if (r.ok) {
    webhookInfo = await r.json();
    ok(
      "Bot token + shop URL",
      Boolean(webhookInfo.ok),
      webhookInfo.shopUrl || webhookInfo.error || "—"
    );
  } else {
    ok("Bot token + shop URL", false, `HTTP ${r.status}`);
  }
} catch (e) {
  ok("Bot token + shop URL", false, e.message);
}

console.log("\n--- Xulosa ---");
if (!shopUp) {
  console.log("Do'kon ishlamayapti: cd mebellar-shop && npm run dev");
} else if (!tgApi) {
  console.log("Bot javob bermaydi — kompyuterda VPN yoqing (Cloudflare WARP), keyin:");
  console.log("  npm run telegram:poll");
} else if (pollResult?.error === "poll failed") {
  console.log("Telegram API ga ulanish yo'q. VPN yoqing va qayta tekshiring.");
} else if (webhookInfo?.shopUrl?.startsWith("http://10.")) {
  console.log("LAN URL faqat bir Wi-Fi da ishlaydi. Mobil internet uchun tunnel kerak:");
  console.log("  cd .. && npm run tunnel:shop");
  console.log("  node scripts/update-shop-env-url.mjs https://YANGI-URL.trycloudflare.com");
} else {
  console.log("Bot ishlashi kerak. Telegramda /start yuboring.");
}
console.log("");
