import { NextRequest, NextResponse } from "next/server";
import {
  addMessage,
  readChatStore,
  setAgreement,
  updateActiveSketch,
} from "@/lib/chat-persistence";
import type { SketchData } from "@/lib/sketch-types";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const state = await readChatStore();
  return json(state);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action as string;

  if (action === "message") {
    const state = await addMessage(body.sender, {
      text: body.text,
      sketch: body.sketch as SketchData | undefined,
    });
    return json(state);
  }

  if (action === "agree") {
    const state = await setAgreement(body.sender);
    return json(state);
  }

  return json({ error: "Unknown action" }, 400);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (body.action === "updateSketch") {
    const state = await updateActiveSketch(body.sketch, body.sender);
    return json(state);
  }
  return json({ error: "Unknown action" }, 400);
}
