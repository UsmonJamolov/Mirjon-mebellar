export function getChatDayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatChatDayLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const todayKey = getChatDayKey(now.toISOString());
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = getChatDayKey(yesterday.toISOString());
  const key = getChatDayKey(iso);

  if (key === todayKey) return "Bugun";
  if (key === yesterdayKey) return "Kecha";

  return d.toLocaleDateString("uz-UZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function shouldShowChatDaySeparator(
  messages: { createdAt: string }[],
  index: number
): boolean {
  if (index === 0) return true;
  return getChatDayKey(messages[index].createdAt) !== getChatDayKey(messages[index - 1].createdAt);
}
