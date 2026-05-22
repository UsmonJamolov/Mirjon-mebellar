import type { ChatThreadState } from "./chat-types";

const ONLINE_MS = 90_000;

export function isOrderStarted(thread: ChatThreadState): boolean {
  return thread.status === "buyurtma_boshlandi";
}

/** Mijoz eskizni tahrirlay olmaydi */
export function isSketchLockedForCustomer(thread: ChatThreadState): boolean {
  return isOrderStarted(thread);
}

export function isAdminOnline(lastSeenAt?: string | null): boolean {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_MS;
}

export function formatAdminPresence(lastSeenAt?: string | null): {
  online: boolean;
  label: string;
  className: string;
} {
  if (isAdminOnline(lastSeenAt)) {
    return { online: true, label: "Onlayn", className: "text-green-600" };
  }
  if (!lastSeenAt) {
    return { online: false, label: "Offline", className: "text-gray-400" };
  }
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  let label: string;
  if (mins < 1) label = "Bir necha soniya oldin onlayn edi";
  else if (mins < 60) label = `${mins} daqiqa oldin onlayn edi`;
  else if (hours < 24) label = `${hours} soat oldin onlayn edi`;
  else label = `${days} kun oldin onlayn edi`;

  return { online: false, label, className: "text-gray-500" };
}
