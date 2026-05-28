import { NextRequest, NextResponse } from "next/server";
import { listCustomers } from "@/lib/customer-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? undefined;
    const customers = await listCustomers(q);
    return NextResponse.json(customers);
  } catch (e) {
    console.error("[customers] GET error:", e);
    return NextResponse.json(
      { error: "Mijozlar yuklashda xato" },
      { status: 500 }
    );
  }
}
