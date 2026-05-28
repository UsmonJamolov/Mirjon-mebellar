import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { getSettingsDoc } from "@/lib/models/Settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Material nomi kerak" }, { status: 400 });
    }
    const doc = await getSettingsDoc();
    if (!doc.materials.includes(name)) {
      doc.materials.push(name);
      await doc.save();
    }
    return NextResponse.json({ materials: doc.materials });
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Material qo'shishda xato" },
      { status: 500 }
    );
  }
}
