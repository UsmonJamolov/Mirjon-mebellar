import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Kirish kerak" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user });
}
