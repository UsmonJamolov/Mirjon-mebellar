/**
 * Telegram update'larini qayta ishlovchi umumiy handler.
 * Webhook va polling endpoint'lari ikkisi ham shu funksiyani chaqiradi.
 */
import {
  attachPhoneToSession,
  attachTelegramToSession,
  findSessionByPhone,
  findSessionByTelegramChat,
  getOtpSession,
  markOtpDelivered,
} from "@/lib/otp-store";
import {
  sendOtpToTelegram,
  sendTelegramMessage,
  TELEGRAM_BOT_TOKEN,
} from "@/lib/telegram";

export interface TgUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TgContact {
  phone_number: string;
  first_name?: string;
  last_name?: string;
  user_id?: number;
}

export interface TgMessage {
  message_id: number;
  from?: TgUser;
  chat: { id: number; type: string };
  text?: string;
  contact?: TgContact;
}

export interface TgUpdate {
  update_id: number;
  message?: TgMessage;
}

function parseStartPayload(text: string): string | null {
  const m = text.match(/^\/start\s+(.+)$/);
  return m ? m[1].trim() : null;
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length >= 9 && !raw.startsWith("+")) return `+${digits}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

async function sendContactKeyboard(chatId: number) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text:
            "Davom etish uchun <b>Telefon raqamni ulashish</b> tugmasini bosing.",
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              [{ text: "📱 Telefon raqamni ulashish", request_contact: true }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }),
      }
    );
  } catch (e) {
    console.warn("Telegram contact keyboard error:", e);
  }
}

async function removeKeyboard(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: { remove_keyboard: true },
        }),
      }
    );
  } catch (e) {
    console.warn("Telegram remove keyboard error:", e);
  }
}

/**
 * Bitta Telegram update'ini qayta ishlash.
 * Webhook va polling endpoint'lari uchun bir xil mantiq.
 */
export async function handleTelegramUpdate(update: TgUpdate): Promise<void> {
  const msg = update.message;
  if (!msg?.from) return;

  const chatId = msg.chat.id;
  const from = msg.from;
  const text = msg.text ?? "";

  // 1) /start <token>
  if (text.startsWith("/start")) {
    const payload = parseStartPayload(text);
    if (!payload) {
      await sendTelegramMessage({
        chatId,
        text:
          "Salom! <b>MMEBEL</b> botiga xush kelibsiz.\n\n" +
          "Saytdagi <b>Telegram botga o'tish</b> tugmasini bosing va shu yerga qayting.",
      });
      return;
    }

    const session = await getOtpSession(payload);
    if (!session) {
      await sendTelegramMessage({
        chatId,
        text:
          "Bu so'rov yaroqsiz yoki muddati o'tib ketgan.\n" +
          "Iltimos, saytga qayting va qayta urinib ko'ring.",
      });
      return;
    }

    await attachTelegramToSession(payload, {
      id: String(chatId),
      firstName: from.first_name,
      lastName: from.last_name,
      username: from.username,
    });

    if (session.phone) {
      const ok = await sendOtpToTelegram(chatId, session.code, from.first_name);
      if (ok) await markOtpDelivered(payload);
      await removeKeyboard(
        chatId,
        "Kodni saytda <b>6 ta xonaga</b> kiriting.",
      );
    } else {
      await sendContactKeyboard(chatId);
    }
    return;
  }

  // 2) Contact share
  if (msg.contact) {
    const phone = normalizePhone(msg.contact.phone_number);

    let session = await findSessionByTelegramChat(String(chatId));
    if (!session && phone) {
      session = await findSessionByPhone(phone);
      if (session) {
        await attachTelegramToSession(session.token, {
          id: String(chatId),
          firstName: from.first_name,
          lastName: from.last_name,
          username: from.username,
        });
      }
    }

    if (session) {
      await attachPhoneToSession(session.token, phone);
      const ok = await sendOtpToTelegram(chatId, session.code, from.first_name);
      if (ok) await markOtpDelivered(session.token);
      await removeKeyboard(
        chatId,
        "Rahmat! Kodni saytda <b>6 ta xonaga</b> kiriting.",
      );
    } else {
      await sendTelegramMessage({
        chatId,
        text:
          "Hozirda faol kirish so'rovi topilmadi.\n" +
          "Saytga qayting va telefon raqamingizni qayta kiriting.",
      });
    }
    return;
  }

  // 3) Default
  if (text === "/help" || text === "/menu") {
    await sendTelegramMessage({
      chatId,
      text:
        "MMEBEL kirish boti.\n\n" +
        "Saytda telefon raqam kiritganingizda kod shu yerga yuboriladi.",
    });
  }
}
