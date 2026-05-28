import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { getSettingsDoc, settingsToDto } from "@/lib/models/Settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await getSettingsDoc();
    return NextResponse.json(settingsToDto(doc));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Sozlamalar yuklashda xato" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const doc = await getSettingsDoc();
    const fields = [
      "storeName",
      "phone",
      "email",
      "address",
      "currency",
      "timezone",
      "logo",
      "materials",
    ] as const;
    for (const f of fields) {
      if (body[f] === undefined) continue;
      if (f === "logo") {
        const logo = String(body.logo ?? "").trim();
        if (logo.startsWith("data:") && logo.length > 600_000) {
          return NextResponse.json(
            { error: "Logo juda katta — 500 KB dan kichik rasm yuklang" },
            { status: 400 }
          );
        }
        (doc as Record<string, unknown>).logo = logo;
        continue;
      }
      (doc as Record<string, unknown>)[f] = body[f];
    }
    await doc.save();
    return NextResponse.json(settingsToDto(doc));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Saqlashda xato" },
      { status: 500 }
    );
  }
}
