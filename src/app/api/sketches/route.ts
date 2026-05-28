import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { SavedSketchModel, toSketchDto } from "@/lib/models/SavedSketch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const docs = await SavedSketchModel.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(docs.map(toSketchDto));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Eskizlar yuklashda xato" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const type = String(body.type ?? "Shkaf");
    const length = Number(body.length) || 0;
    const width = Number(body.width) || 0;
    const height = Number(body.height) || 0;
    const material = String(body.material ?? "").trim();

    const doc = await SavedSketchModel.create({
      externalId: `sk-${Date.now()}`,
      type,
      length,
      width,
      height,
      material,
      title:
        String(body.title ?? "").trim() ||
        `${type} ${length}×${width}×${height}`,
    });

    return NextResponse.json(toSketchDto(doc), { status: 201 });
  } catch (e) {
    console.error("Sketch save error:", e);
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Saqlashda xato" },
      { status: 500 }
    );
  }
}
