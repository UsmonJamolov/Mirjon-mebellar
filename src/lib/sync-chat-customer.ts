import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  formatCustomerDisplayName,
  splitFullName,
} from "@/lib/chat-customer";
import type { ChatThreadState } from "@/lib/chat-types";
import { User } from "@/lib/models/User";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 9) return `+998${digits}`;
  if (raw.startsWith("+")) return raw;
  return `+${digits}`;
}

function hasCustomerIdentity(state: ChatThreadState) {
  const fromParts = formatCustomerDisplayName(
    state.customerFirstName,
    state.customerLastName,
    ""
  );
  if (fromParts) return true;
  const legacy = state.customerName?.trim();
  return Boolean(legacy && legacy !== "Mijoz");
}

function hasCustomerMessages(state: ChatThreadState) {
  return state.messages.some((m) => m.sender === "customer");
}

async function lookupByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const digits = normalized.replace(/\D/g, "");
  return User.findOne({
    role: "customer",
    $or: [
      { phone: normalized },
      { phone: digits },
      { phone: phone.replace(/\s/g, "") },
    ],
  }).lean();
}

async function inferCustomerUser() {
  const total = await User.countDocuments({ role: "customer" });
  if (total === 1) {
    return User.findOne({ role: "customer" }).lean();
  }

  const withTelegram = await User.find({
    role: "customer",
    telegramId: { $exists: true, $nin: [null, ""] },
  })
    .sort({ updatedAt: -1 })
    .limit(1)
    .lean();

  if (withTelegram[0]) return withTelegram[0];

  return User.findOne({ role: "customer" }).sort({ updatedAt: -1 }).lean();
}

async function resolveCustomerUser(state: ChatThreadState) {
  const userId = state.customerUserId?.trim();
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const byId = await User.findById(userId).lean();
    if (byId) return byId;
  }

  if (state.customerPhone?.trim()) {
    const byPhone = await lookupByPhone(state.customerPhone);
    if (byPhone) return byPhone;
  }

  if (!hasCustomerMessages(state)) return null;
  return inferCustomerUser();
}

function applyUserToState(
  state: ChatThreadState,
  user: {
    _id: mongoose.Types.ObjectId;
    name?: string;
    phone?: string;
    image?: string;
    telegramUsername?: string;
  }
): ChatThreadState {
  const split = splitFullName(user.name ?? "");
  const firstName = state.customerFirstName?.trim() || split.firstName;
  const lastName = state.customerLastName?.trim() || split.lastName;
  const customerName = formatCustomerDisplayName(
    firstName,
    lastName,
    user.name ?? ""
  );

  return {
    ...state,
    customerUserId: user._id.toString(),
    customerFirstName: firstName,
    customerLastName: lastName,
    customerName,
    customerPhone: state.customerPhone?.trim() || user.phone || "",
    customerAvatar: state.customerAvatar?.trim() || user.image || "",
    customerTelegramUsername:
      state.customerTelegramUsername?.trim() || user.telegramUsername || "",
  };
}

/** Chat store'da bo'sh mijoz maydonlarini MongoDB User bilan to'ldiradi */
export async function syncChatCustomerIdentity(
  state: ChatThreadState
): Promise<{ state: ChatThreadState; changed: boolean }> {
  if (state.cleared || hasCustomerIdentity(state)) {
    return { state, changed: false };
  }

  try {
    await connectDB();
    const user = await resolveCustomerUser(state);
    if (!user?.name?.trim()) return { state, changed: false };

    const next = applyUserToState(state, user);
    const changed =
      next.customerUserId !== state.customerUserId ||
      next.customerFirstName !== state.customerFirstName ||
      next.customerLastName !== state.customerLastName ||
      next.customerName !== state.customerName ||
      next.customerPhone !== state.customerPhone;

    return { state: next, changed };
  } catch (e) {
    console.error("[sync-chat-customer]", e);
    return { state, changed: false };
  }
}
