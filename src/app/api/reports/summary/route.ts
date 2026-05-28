import { NextResponse } from "next/server";
import { buildReportSummary } from "@/lib/order-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = await buildReportSummary();
    return NextResponse.json(summary);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Hisobot yuklashda xato" }, { status: 500 });
  }
}
