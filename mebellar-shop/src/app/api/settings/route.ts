import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { getSettingsDoc, settingsToPublicDto } from "@/lib/models/Settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await getSettingsDoc();
    return NextResponse.json(settingsToPublicDto(doc));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Sozlamalar yuklanmadi" },
      { status: 500 }
    );
  }
}
