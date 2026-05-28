import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { ProductModel, toProductDto } from "@/lib/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const filter: Record<string, unknown> = {};

    if (searchParams.get("popular") === "true") filter.isPopular = true;
    if (searchParams.get("recommended") === "true") filter.isRecommended = true;
    const cat = searchParams.get("cat");
    if (cat) {
      const { CategoryModel } = await import("@/lib/models/Category");
      const categoryDoc = await CategoryModel.findOne({ slug: cat });
      if (categoryDoc?.name) filter.category = categoryDoc.name;
    }
    if (searchParams.get("q")) {
      filter.name = { $regex: searchParams.get("q"), $options: "i" };
    }

    const docs = await ProductModel.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(docs.map(toProductDto));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Mahsulotlarni yuklashda xato" },
      { status: 500 }
    );
  }
}
