import { connectDB } from "@/lib/mongodb";
import { formatCustomerDisplayName, splitFullName } from "@/lib/chat-customer";
import { User } from "@/lib/models/User";

export type ChatThreadListRow = {
  id: string;
  customerName: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerAvatar: string;
  customerTelegramUsername: string;
  lastMessage: string;
  time: string;
  isLive?: boolean;
  unread?: number;
  status?: string;
};

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 9) return `+998${digits}`;
  if (raw.startsWith("+")) return raw;
  return `+${digits}`;
}

function hasDisplayName(row: ChatThreadListRow) {
  const fromParts = formatCustomerDisplayName(
    row.customerFirstName,
    row.customerLastName,
    ""
  );
  if (fromParts) return true;
  const legacy = row.customerName?.trim();
  return Boolean(legacy && legacy !== "Mijoz");
}

async function lookupUserByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const digits = normalized.replace(/\D/g, "");
  return User.findOne({
    $or: [
      { phone: normalized },
      { phone: digits },
      { phone: phone.replace(/\s/g, "") },
    ],
  }).lean();
}

export async function enrichChatThreads(
  threads: ChatThreadListRow[]
): Promise<ChatThreadListRow[]> {
  if (!threads.length) return threads;

  const needsLookup = threads.some((t) => !hasDisplayName(t) && Boolean(t.customerPhone?.trim()));
  if (!needsLookup) return threads;

  await connectDB();

  return Promise.all(
    threads.map(async (t) => {
      if (hasDisplayName(t) || !t.customerPhone?.trim()) return t;

      const doc = await lookupUserByPhone(t.customerPhone);
      if (!doc?.name?.trim()) return t;

      const split = splitFullName(doc.name);
      const firstName = t.customerFirstName?.trim() || split.firstName;
      const lastName = t.customerLastName?.trim() || split.lastName;
      const customerName = formatCustomerDisplayName(firstName, lastName, doc.name);

      return {
        ...t,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerName,
        customerPhone: t.customerPhone || doc.phone || "",
        customerAvatar: t.customerAvatar || doc.image || "",
        customerTelegramUsername:
          t.customerTelegramUsername || doc.telegramUsername || "",
      };
    })
  );
}
