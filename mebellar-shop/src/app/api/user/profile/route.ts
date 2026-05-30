import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { getRequestUser } from "@/lib/request-user";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { normalizePhone, phoneToLoginEmail } from "@/lib/phone-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_DIR = path.join(process.cwd(), "public", "avatars");

async function updateContact(userId: string, name: string, phone: string) {
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Ism kamida 2 harf bo'lishi kerak" }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  const digits = normalizedPhone.replace(/\D/g, "");
  if (digits.length < 9) {
    return NextResponse.json({ error: "Telefon raqam noto'g'ri" }, { status: 400 });
  }

  await connectDB();

  const duplicate = await User.findOne({
    _id: { $ne: userId },
    $or: [{ phone: normalizedPhone }, { email: phoneToLoginEmail(normalizedPhone) }],
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "Bu telefon boshqa hisobda ro'yxatdan o'tgan" },
      { status: 409 }
    );
  }

  const email = phoneToLoginEmail(normalizedPhone);
  const user = await User.findByIdAndUpdate(
    userId,
    { name, phone: normalizedPhone, email },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    name: user.name,
    phone: user.phone,
  });
}

export async function PATCH(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user?.id) {
      return NextResponse.json({ error: "Kirish kerak" }, { status: 401 });
    }

    const userId = user.id;
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const name = String(body.name ?? "").trim();
      const phone = String(body.phone ?? "");
      return updateContact(userId, name, phone);
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Rasm tanlanmadi" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Faqat rasm fayli" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: "Rasm 2MB dan kichik bo'lishi kerak" }, { status: 400 });
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const filename = `${userId}.${ext}`;
    const imagePath = `/avatars/${filename}`;

    await mkdir(AVATAR_DIR, { recursive: true });

    for (const oldExt of ["jpg", "jpeg", "png", "webp"]) {
      const oldPath = path.join(AVATAR_DIR, `${userId}.${oldExt}`);
      await unlink(oldPath).catch(() => undefined);
    }

    await writeFile(path.join(AVATAR_DIR, filename), buffer);

    await connectDB();
    await User.findByIdAndUpdate(userId, { image: imagePath });

    return NextResponse.json({ ok: true, image: imagePath });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "So'rov bajarilmadi" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getRequestUser(req);
    if (!user?.id) {
      return NextResponse.json({ error: "Kirish kerak" }, { status: 401 });
    }

    const userId = user.id;
    for (const ext of ["jpg", "jpeg", "png", "webp"]) {
      await unlink(path.join(AVATAR_DIR, `${userId}.${ext}`)).catch(() => undefined);
    }

    await connectDB();
    await User.findByIdAndUpdate(userId, { image: "" });

    return NextResponse.json({ ok: true, image: "" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Rasm o'chirilmadi" }, { status: 500 });
  }
}
