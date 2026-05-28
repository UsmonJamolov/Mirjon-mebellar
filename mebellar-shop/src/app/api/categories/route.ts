import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { CategoryModel, toCategoryDto } from "@/lib/models/Category";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const docs = await CategoryModel.find().sort({ name: 1 });
    return NextResponse.json(docs.map(toCategoryDto));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Kategoriyalar yuklanmadi" },
      { status: 500 }
    );
  }
}
