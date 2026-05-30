import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const STORE_PATH = path.join(process.cwd(), "data", "otp-sessions.json");

/** Sessiya muddati — 5 daqiqa */
export const OTP_TTL_MS = 5 * 60 * 1000;
/** "Qayta yuborish" tugmasi qulflanadigan vaqt — 60 sekund */
export const OTP_RESEND_LOCK_MS = 60 * 1000;

export interface OtpTelegramInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
}

export type OtpState = "pending" | "delivered" | "verified" | "expired";

export interface OtpSession {
  token: string;
  code: string;
  state: OtpState;
  createdAt: number;
  expiresAt: number;
  lastSentAt: number;
  /** Saytda kiritilgan telefon raqami (normalizatsiya qilingan) */
  phone?: string;
  telegram?: OtpTelegramInfo;
}

interface OtpStoreFile {
  sessions: Record<string, OtpSession>;
}

async function readStore(): Promise<OtpStoreFile> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as OtpStoreFile;
    return { sessions: parsed.sessions ?? {} };
  } catch {
    return { sessions: {} };
  }
}

async function writeStore(store: OtpStoreFile): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function purgeExpired(store: OtpStoreFile): OtpStoreFile {
  const now = Date.now();
  const next: Record<string, OtpSession> = {};
  for (const [k, s] of Object.entries(store.sessions)) {
    if (s.expiresAt > now - 60 * 60 * 1000) {
      next[k] = s;
    }
  }
  return { sessions: next };
}

function newToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

function newCode(): string {
  return String(crypto.randomInt(100000, 1000000));
}

/** Yangi OTP sessiya ochish */
export async function createOtpSession(phone?: string): Promise<OtpSession> {
  const store = purgeExpired(await readStore());
  const now = Date.now();
  const session: OtpSession = {
    token: newToken(),
    code: newCode(),
    state: "pending",
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    lastSentAt: now,
    phone: phone ?? undefined,
  };
  store.sessions[session.token] = session;
  await writeStore(store);
  return session;
}

/** Mavjud sessiyani olish */
export async function getOtpSession(token: string): Promise<OtpSession | null> {
  if (!token) return null;
  const store = await readStore();
  const s = store.sessions[token];
  if (!s) return null;
  if (s.expiresAt < Date.now() && s.state !== "verified") {
    s.state = "expired";
    store.sessions[token] = s;
    await writeStore(store);
  }
  return s;
}

/** Yangi OTP kod yaratish va lastSentAt ni yangilash (qayta yuborish) */
export async function refreshOtpCode(token: string): Promise<OtpSession | null> {
  const store = await readStore();
  const s = store.sessions[token];
  if (!s) return null;
  const now = Date.now();
  s.code = newCode();
  s.state = "pending";
  s.expiresAt = now + OTP_TTL_MS;
  s.lastSentAt = now;
  store.sessions[token] = s;
  await writeStore(store);
  return s;
}

/** Sessiyaga Telegram chat ma'lumotini biriktirish (faqat metadata) */
export async function attachTelegramToSession(
  token: string,
  telegram: OtpTelegramInfo
): Promise<OtpSession | null> {
  const store = await readStore();
  const s = store.sessions[token];
  if (!s) return null;
  s.telegram = { ...s.telegram, ...telegram };
  store.sessions[token] = s;
  await writeStore(store);
  return s;
}

/** OTP kod muvaffaqiyatli yuborilganini belgilash */
export async function markOtpDelivered(
  token: string
): Promise<OtpSession | null> {
  const store = await readStore();
  const s = store.sessions[token];
  if (!s) return null;
  s.state = "delivered";
  s.lastSentAt = Date.now();
  store.sessions[token] = s;
  await writeStore(store);
  return s;
}

/** Telegram'dan kelgan phone'ni biriktirib qo'yish */
export async function attachPhoneToSession(
  token: string,
  phone: string
): Promise<OtpSession | null> {
  const store = await readStore();
  const s = store.sessions[token];
  if (!s) return null;
  s.phone = phone;
  s.telegram = { ...(s.telegram ?? { id: "" }), phone };
  store.sessions[token] = s;
  await writeStore(store);
  return s;
}

/** Kodni tekshirib, agar to'g'ri bo'lsa sessiyani 'verified' holatga o'tkazadi va qaytaradi */
export async function verifyOtpCode(
  token: string,
  code: string
): Promise<OtpSession | null> {
  if (!token || !code) return null;
  const store = await readStore();
  const s = store.sessions[token];
  if (!s) return null;
  if (s.state === "expired" || s.expiresAt < Date.now()) {
    s.state = "expired";
    store.sessions[token] = s;
    await writeStore(store);
    return null;
  }
  if (s.code !== code.trim()) return null;
  s.state = "verified";
  store.sessions[token] = s;
  await writeStore(store);
  return s;
}

/** Sessiya tugaganda tozalash (verified bo'lganidan keyin) */
export async function consumeOtpSession(token: string): Promise<void> {
  const store = await readStore();
  if (store.sessions[token]) {
    delete store.sessions[token];
    await writeStore(store);
  }
}

/** Telegram chat ID bo'yicha eng yangi pending sessiyani topish */
export async function findSessionByTelegramChat(
  chatId: string
): Promise<OtpSession | null> {
  if (!chatId) return null;
  const store = await readStore();
  let latest: OtpSession | null = null;
  for (const s of Object.values(store.sessions)) {
    if (s.telegram?.id === chatId && s.state !== "expired") {
      if (!latest || s.createdAt > latest.createdAt) {
        latest = s;
      }
    }
  }
  return latest;
}

/** Telefon raqam bo'yicha eng yangi pending/delivered sessiyani topish */
export async function findSessionByPhone(
  phone: string
): Promise<OtpSession | null> {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const store = await readStore();
  let latest: OtpSession | null = null;
  for (const s of Object.values(store.sessions)) {
    if (s.state === "verified" || s.state === "expired") continue;
    const sd = (s.phone ?? s.telegram?.phone ?? "").replace(/\D/g, "");
    if (sd && sd === digits) {
      if (!latest || s.createdAt > latest.createdAt) latest = s;
    }
  }
  return latest;
}
