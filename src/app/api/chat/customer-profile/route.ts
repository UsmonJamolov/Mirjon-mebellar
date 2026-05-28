import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { formatCustomerDisplayName, splitFullName } from "@/lib/chat-customer";
import { readChatStore } from "@/lib/chat-persistence";
import { listCustomers } from "@/lib/customer-persistence";
import { User } from "@/lib/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 9) return `+998${digits}`;
  if (raw.startsWith("+")) return raw;
  return `+${digits}`;
}

export async function GET(req: NextRequest) {
  try {
    const phoneParam = req.nextUrl.searchParams.get("phone") ?? "";
    const thread = await readChatStore();

    const phone = normalizePhone(phoneParam || thread.customerPhone || "");
    const firstName = thread.customerFirstName?.trim() ?? "";
    const lastName = thread.customerLastName?.trim() ?? "";
    const displayName =
      formatCustomerDisplayName(firstName, lastName, "") ||
      (thread.customerName?.trim() && thread.customerName !== "Mijoz"
        ? thread.customerName.trim()
        : "") ||
      "Mijoz";

    let user: {
      name: string;
      email: string;
      phone: string;
      image: string;
      telegramUsername: string;
      createdAt?: Date;
    } | null = null;

    await connectDB();
    if (thread.customerUserId?.trim()) {
      const byId = await User.findById(thread.customerUserId.trim());
      if (byId) {
        user = {
          name: byId.name,
          email: byId.email,
          phone: byId.phone ?? phone,
          image: byId.image ?? "",
          telegramUsername: byId.telegramUsername ?? "",
          createdAt: byId.createdAt,
        };
      }
    }

    if (!user && phone) {
      const digits = phone.replace(/\D/g, "");
      const doc = await User.findOne({
        $or: [{ phone }, { phone: digits }, { phone: phone.replace(/\s/g, "") }],
      });
      if (doc) {
        user = {
          name: doc.name,
          email: doc.email,
          phone: doc.phone ?? phone,
          image: doc.image ?? "",
          telegramUsername: doc.telegramUsername ?? "",
          createdAt: doc.createdAt,
        };
      }
    }

    const customers = await listCustomers();
    const ordersEntry = customers.find((c) => {
      if (phone) {
        const cDigits = (c.phone ?? "").replace(/\D/g, "");
        return cDigits && cDigits === phone.replace(/\D/g, "");
      }
      return c.name === displayName;
    });

    const resolvedName = user?.name ?? displayName;
    const split = splitFullName(resolvedName);

    return NextResponse.json({
      firstName: firstName || split.firstName,
      lastName: lastName || split.lastName,
      fullName: formatCustomerDisplayName(
        firstName || split.firstName,
        lastName || split.lastName,
        resolvedName
      ),
      phone: phone || user?.phone || thread.customerPhone || "",
      email: user?.email ?? "",
      image: thread.customerAvatar || user?.image || "",
      telegramUsername:
        thread.customerTelegramUsername || user?.telegramUsername || "",
      registeredAt: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("uz-UZ")
        : "",
      ordersCount: ordersEntry?.orders.length ?? 0,
      lastOrderDate: ordersEntry?.lastOrderDate ?? "",
      presenceLabel: thread.customerLastSeenAt
        ? new Date(thread.customerLastSeenAt).toLocaleString("uz-UZ")
        : "",
    });
  } catch (e) {
    console.error("[customer-profile]", e);
    return NextResponse.json({ error: "Profil yuklanmadi" }, { status: 500 });
  }
}
