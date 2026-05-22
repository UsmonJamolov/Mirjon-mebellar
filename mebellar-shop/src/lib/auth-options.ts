import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import {
  isEmailLike,
  normalizePhone,
  phoneToLoginEmail,
} from "@/lib/phone-auth";

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "mebellar-dev-secret-change-in-production";

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/kirish",
    error: "/kirish",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Telefon yoki email", type: "text" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.email?.trim().toLowerCase() ?? "";
        const password = credentials?.password;

        if (!identifier || !password) return null;

        await connectDB();
        const user = isEmailLike(identifier)
          ? await User.findOne({ email: identifier }).select("+passwordHash")
          : await User.findOne({
              $or: [
                { phone: normalizePhone(identifier) },
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
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
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
        session.user.id = token.id as string;
        if (token.name) session.user.name = token.name as string;
        session.user.role = (token.role as string) ?? "customer";
        session.user.phone = (token.phone as string) ?? "";
        session.user.image = (token.image as string) ?? "";
      }
      return session;
    },
  },
};
