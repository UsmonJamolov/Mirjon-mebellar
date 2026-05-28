import { NextRequest, NextResponse } from "next/server";
import {
  getOrderByNumber,
  patchOrderStatus,
  type OrderStatus,
} from "@/lib/order-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrderByNumber(id);
  if (!order) {
    return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body.status as OrderStatus;
  if (!status || !["yangi", "jarayonda", "tugallangan", "bekor"].includes(status)) {
    return NextResponse.json({ error: "Noto'g'ri holat" }, { status: 400 });
  }
  const order = await patchOrderStatus(id, status);
  if (!order) {
    return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
  }
  return NextResponse.json(order);
}
