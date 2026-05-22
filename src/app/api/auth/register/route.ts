import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { dbConnectionMessage } from "@/lib/db-errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SECRET .env.local da belgilang");
  }
  return secret;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const adminSecret = String(body.adminSecret ?? "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Ism kamida 2 harf bo'lishi kerak" }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Email noto'g'ri" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Parol kamida 6 belgi" }, { status: 400 });
    }

    let expectedSecret: string;
    try {
      expectedSecret = getAdminSecret();
    } catch {
      return NextResponse.json(
        { error: "Serverda ADMIN_SECRET sozlanmagan" },
        { status: 500 }
      );
    }

    if (adminSecret !== expectedSecret) {
      return NextResponse.json({ error: "Admin kaliti noto'g'ri" }, { status: 403 });
    }

    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Bu email allaqachon ro'yxatdan o'tgan" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
    });

    return NextResponse.json(
      {
        ok: true,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    const dbMsg = dbConnectionMessage(e);
    return NextResponse.json(
      { error: dbMsg ?? "Ro'yxatdan o'tishda xato" },
      { status: dbMsg ? 503 : 500 }
    );
  }
}
