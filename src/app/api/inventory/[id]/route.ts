import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import {
  InventoryModel,
  inventoryStatus,
  toInventoryDto,
} from "@/lib/models/Inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const doc = await InventoryModel.findOne({ externalId: id });
    if (!doc) {
      return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    }

    const fields = ["name", "category", "quantity", "unit", "status"] as const;
    for (const f of fields) {
      if (body[f] !== undefined) doc[f] = body[f];
    }
    if (body.quantity !== undefined) {
      doc.status = inventoryStatus(Number(body.quantity) || 0);
    }
    await doc.save();

    return NextResponse.json(toInventoryDto(doc));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Yangilashda xato" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteCtx) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const r = await InventoryModel.deleteOne({ externalId: id });
    if (!r.deletedCount) {
      return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "O'chirishda xato" },
      { status: 500 }
    );
  }
}
