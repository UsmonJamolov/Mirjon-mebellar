export function dbConnectionMessage(e: unknown): string | null {
  if (!(e instanceof Error)) return null;
  const m = e.message.toLowerCase();
  if (m.includes("mongoserverselection") || m.includes("connect econnrefused")) {
    return "MongoDB ulanmadi — .env.local da MONGODB_URI ni tekshiring";
  }
  if (m.includes("mongodb_uri")) return e.message;
  return null;
}
