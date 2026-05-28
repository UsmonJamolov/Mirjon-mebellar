/**
 * Telegram polling — brauzer yopiq bo'lsa ham bot ishlaydi.
 * Shop server (:3001) ishlab turishi kerak.
 */
const BASE = process.env.SHOP_URL?.replace(/\/$/, "") || "http://localhost:3001";
const MS = Number(process.env.POLL_MS) || 2500;

console.log(`Telegram poll -> ${BASE}/api/telegram/poll (har ${MS}ms)`);

async function tick() {
  try {
    const res = await fetch(`${BASE}/api/telegram/poll`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (data.processed > 0) {
      console.log(new Date().toLocaleTimeString(), "processed:", data.processed);
    }
  } catch (e) {
    console.warn("poll xato — server ishlayaptimi?", e.message);
  }
}

await tick();
setInterval(tick, MS);
