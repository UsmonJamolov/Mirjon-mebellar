import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { normalizePhone, phoneToLoginEmail } from "@/lib/phone-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const phone = normalizePhone(String(body.phone ?? ""));
    const password = String(body.password ?? "");

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Ism kamida 2 harf bo'lishi kerak" }, { status: 400 });
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      return NextResponse.json({ error: "Telefon raqam noto'g'ri" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Parol kamida 6 belgi" }, { status: 400 });
    }

    const email = phoneToLoginEmail(phone);

    await connectDB();
    const exists = await User.findOne({
      $or: [{ phone }, { email }],
    });
    if (exists) {
      return NextResponse.json(
        { error: "Bu telefon allaqachon ro'yxatdan o'tgan" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, role: "customer" });

    return NextResponse.json(
      {
        ok: true,
        user: { id: user._id.toString(), name: user.name, phone: user.phone },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ro'yxatdan o'tishda xato" }, { status: 500 });
  }
}
