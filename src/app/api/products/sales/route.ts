import { NextResponse } from "next/server";
import { getProductSalesMap } from "@/lib/product-sales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const map = await getProductSalesMap();
  const sales = Object.fromEntries(map.entries());
  return NextResponse.json({ sales });
}
