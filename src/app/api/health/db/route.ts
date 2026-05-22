import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, getDbName } from "@/lib/mongodb";

/** MongoDB ulanishni tekshirish: GET /api/health/db */
export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    return NextResponse.json({
      ok: state === 1,
      db: getDbName(),
      state: state === 1 ? "connected" : "disconnected",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "MongoDB xatosi";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
