import type { ChatThreadState } from "./chat-types";

/** Admin chat sahifasida ~4s heartbeat — 30s dan keyin offline */
export const PRESENCE_ONLINE_MS = 30_000;

export function isOrderStarted(thread: ChatThreadState): boolean {
  return thread.status === "buyurtma_boshlandi";
}

export function isSketchLockedForCustomer(thread: ChatThreadState): boolean {
  return isOrderStarted(thread);
}

export function isUserOnline(lastSeenAt?: string | null): boolean {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < PRESENCE_ONLINE_MS;
}

function formatLastSeenLabel(lastSeenAt: string): string {
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return "Bir necha soniya oldin onlayn edi";
  if (mins < 60) return `${mins} daqiqa oldin onlayn edi`;
  if (hours < 24) return `${hours} soat oldin onlayn edi`;
  return `${days} kun oldin onlayn edi`;
}

export function formatAdminPresence(lastSeenAt?: string | null): {
  online: boolean;
  label: string;
  className: string;
} {
  if (isUserOnline(lastSeenAt)) {
    return { online: true, label: "Onlayn", className: "text-green-600" };
  }
  if (!lastSeenAt) {
    return { online: false, label: "Offline", className: "text-gray-400" };
  }
  return {
    online: false,
    label: formatLastSeenLabel(lastSeenAt),
    className: "text-gray-500",
  };
}

export function formatCustomerPresence(lastSeenAt?: string | null): {
  online: boolean;
  label: string;
  className: string;
} {
  if (isUserOnline(lastSeenAt)) {
    return { online: true, label: "Onlayn", className: "text-green-600" };
  }
  if (!lastSeenAt) {
    return { online: false, label: "Offline", className: "text-gray-400" };
  }
  return {
    online: false,
    label: formatLastSeenLabel(lastSeenAt),
    className: "text-gray-500",
  };
}
