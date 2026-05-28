/** Telegram bot bilan ishlash uchun yordamchi (server-side) */

const TELEGRAM_API = "https://api.telegram.org";

export const TELEGRAM_BOT_USERNAME =
  process.env.TELEGRAM_BOT_USERNAME?.trim() || "mebeluz_bot";

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";

export const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

export function botStartUrl(payload: string): string {
  return `${TELEGRAM_BOT_URL}?start=${encodeURIComponent(payload)}`;
}

export function isTelegramConfigured(): boolean {
  return TELEGRAM_BOT_TOKEN.length > 0;
}

interface TelegramSendOptions {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
}

/** Telegram chat'ga xabar yuborish */
export async function sendTelegramMessage(opts: TelegramSendOptions): Promise<boolean> {
  if (!isTelegramConfigured()) return false;
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: opts.chatId,
        text: opts.text,
        parse_mode: opts.parseMode ?? "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.warn("Telegram sendMessage muvaffaqiyatsiz:", await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("Telegram sendMessage xato:", e);
    return false;
  }
}

/** Foydalanuvchiga OTP kodni Telegram orqali yuborish */
export async function sendOtpToTelegram(
  chatId: string | number,
  code: string,
  firstName?: string
): Promise<boolean> {
  const greeting = firstName ? `Salom, <b>${firstName}</b>!` : "Salom!";
  const text =
    `${greeting}\n\n` +
    `Sizning <b>MMEBEL</b> kirish kodingiz:\n\n` +
    `<b><code>${code}</code></b>\n\n` +
    `Bu kodni saytda <b>6 ta xonaga</b> kiriting. Kod 5 daqiqa amal qiladi.\n\n` +
    `Agar siz so'ramagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.`;
  return sendTelegramMessage({ chatId, text });
}
