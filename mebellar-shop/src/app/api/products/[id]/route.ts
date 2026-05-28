import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { ProductModel, toProductDto } from "@/lib/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const doc = await ProductModel.findOne({ externalId: id });
    if (!doc) {
      return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    }
    return NextResponse.json(toProductDto(doc));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Mahsulot yuklashda xato" },
      { status: 500 }
    );
  }
}
