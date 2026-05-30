import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { normalizePhone, phoneToLoginEmail } from "@/lib/phone-auth";
import { consumeOtpSession, verifyOtpCode } from "@/lib/otp-store";
import { signMobileToken, type MobileUserPayload } from "@/lib/mobile-auth";

export async function signInWithOtp(
  token: string,
  code: string
): Promise<{ user: MobileUserPayload; accessToken: string } | null> {
  const session = await verifyOtpCode(token, code);
  if (!session?.telegram?.id) return null;

  await connectDB();

  const tg = session.telegram;
  const telegramId = tg.id;
  const phone = tg.phone ? normalizePhone(tg.phone) : "";
  const name =
    [tg.firstName, tg.lastName].filter(Boolean).join(" ").trim() ||
    (tg.username ? `@${tg.username}` : "Mijoz");

  let user = await User.findOne({ telegramId });
  if (!user && phone) {
    user = await User.findOne({ phone });
  }

  if (!user) {
    const email = telegramId
      ? `tg_${telegramId}@mmebel.local`
      : phone
        ? phoneToLoginEmail(phone)
        : `guest_${crypto.randomBytes(6).toString("hex")}@mmebel.local`;
    user = await User.create({
      name,
      email,
      phone,
      telegramId,
      telegramUsername: tg.username ?? "",
      role: "customer",
    });
  } else {
    let dirty = false;
    if (telegramId && user.telegramId !== telegramId) {
      user.telegramId = telegramId;
      dirty = true;
    }
    if (tg.username && user.telegramUsername !== tg.username) {
      user.telegramUsername = tg.username;
      dirty = true;
    }
    if (phone && !user.phone) {
      user.phone = phone;
      dirty = true;
    }
    if (dirty) await user.save();
  }

  await consumeOtpSession(token);

  const payload: MobileUserPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    image: user.image ?? "",
    role: user.role,
  };

  return { user: payload, accessToken: await signMobileToken(payload) };
}
