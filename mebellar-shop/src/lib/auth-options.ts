import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import {
  isEmailLike,
  normalizePhone,
  phoneToLoginEmail,
} from "@/lib/phone-auth";
import {
  AUTH_SECRET,
  SHOP_SESSION_COOKIE_NAME,
  shopSessionCookieOptions,
} from "@/lib/auth-cookies";
import { consumeOtpSession, verifyOtpCode } from "@/lib/otp-store";

export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  ...(process.env.AUTH_TRUST_HOST === "true" ? { trustHost: true } : {}),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: SHOP_SESSION_COOKIE_NAME,
      options: shopSessionCookieOptions(),
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Telefon yoki email", type: "text" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        const raw = credentials?.email?.trim() ?? "";
        const password = credentials?.password;

        if (!raw || !password) return null;

        const identifier = isEmailLike(raw) ? raw.toLowerCase() : normalizePhone(raw);
        if (!identifier) return null;

        await connectDB();
        const user = isEmailLike(identifier)
          ? await User.findOne({
              $or: [
                { email: identifier },
                { email: phoneToLoginEmail(identifier.replace(/@.*/, "")) },
              ],
            }).select("+passwordHash")
          : await User.findOne({
              $or: [
                { phone: identifier },
                { email: phoneToLoginEmail(identifier) },
              ],
            }).select("+passwordHash");
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          image: user.image ?? "",
          role: user.role,
        };
      },
    }),

    CredentialsProvider({
      id: "telegram-otp",
      name: "Telegram OTP",
      credentials: {
        token: { label: "Sessiya tokeni", type: "text" },
        code: { label: "6 xonali kod", type: "text" },
      },
      async authorize(credentials) {
        const token = String(credentials?.token ?? "").trim();
        const code = String(credentials?.code ?? "").trim();
        if (!token || !code) return null;

        const session = await verifyOtpCode(token, code);
        if (!session) return null;

        await connectDB();

        const tg = session.telegram;
        const telegramId = tg?.id ?? "";
        const phone = tg?.phone ? normalizePhone(tg.phone) : "";
        const name =
          [tg?.firstName, tg?.lastName].filter(Boolean).join(" ").trim() ||
          (tg?.username ? `@${tg.username}` : "Mijoz");

        let user = null as Awaited<ReturnType<typeof User.findOne>> | null;
        if (telegramId) {
          user = await User.findOne({ telegramId });
        }
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
            telegramUsername: tg?.username ?? "",
            role: "customer",
          });
        } else {
          let dirty = false;
          if (telegramId && user.telegramId !== telegramId) {
            user.telegramId = telegramId;
            dirty = true;
          }
          if (tg?.username && user.telegramUsername !== tg.username) {
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

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          image: user.image ?? "",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as { role?: string }).role ?? "customer";
        token.phone = (user as { phone?: string }).phone ?? "";
        token.image = (user as { image?: string }).image ?? "";
      }

      if (trigger === "update") {
        const payload = session as {
          image?: string;
          name?: string;
          phone?: string;
        } | undefined;

        if (payload?.image !== undefined) token.image = payload.image;
        if (payload?.name !== undefined) token.name = payload.name;
        if (payload?.phone !== undefined) token.phone = payload.phone;

        if (
          token.id &&
          payload &&
          payload.image === undefined &&
          payload.name === undefined &&
          payload.phone === undefined
        ) {
          await connectDB();
          const dbUser = await User.findById(token.id).select("name image phone role");
          if (dbUser) {
            token.name = dbUser.name;
            token.image = dbUser.image ?? "";
            token.phone = dbUser.phone ?? "";
            token.role = dbUser.role;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub) as string;
        session.user.name = (token.name as string | undefined) ?? session.user.name;
        session.user.email = (token.email as string | undefined) ?? session.user.email;
        session.user.role = (token.role as string) ?? "customer";
        session.user.phone = (token.phone as string) ?? "";
        session.user.image = (token.image as string) ?? "";
      }
      return session;
    },
  },
};
