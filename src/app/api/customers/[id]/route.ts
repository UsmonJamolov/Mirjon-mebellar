import { NextRequest, NextResponse } from "next/server";
import { deleteCustomerById } from "@/lib/customer-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    const result = await deleteCustomerById(id);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Mijozni o'chirishda xato";
    const status = message === "Mijoz topilmadi" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
