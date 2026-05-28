import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import type { ChatSender } from "@/lib/chat-types";
import type { SketchData } from "@/lib/sketch-types";
import {
  addMessage,
  cancelAgreement,
  deleteMessage,
  readChatStore,
  setAgreement,
  startNewOrder,
  touchAdminPresence,
  touchCustomerPresence,
  updateActiveSketch,
} from "@/lib/chat-persistence";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const state = await readChatStore();
  return NextResponse.json(state, { headers: CORS_HEADERS });
}

async function requireCustomerSession() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Kirish talab qilinadi" },
      { status: 401, headers: CORS_HEADERS }
    );
  }
  return session;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      sender?: ChatSender;
      text?: string;
      sketch?: SketchData;
      messageId?: string;
      customerUserId?: string;
      customerName?: string;
      customerPhone?: string;
      customerAvatar?: string;
      customerFirstName?: string;
      customerLastName?: string;
      customerTelegramUsername?: string;
    };

    const action = body.action;
    const sender = body.sender ?? "customer";

    if (sender === "customer") {
      const auth = await requireCustomerSession();
      if (auth instanceof NextResponse) return auth;
    }

    if (action === "message") {
      const state = await addMessage(sender, {
        text: body.text,
        sketch: body.sketch,
        customerUserId: body.customerUserId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerAvatar: body.customerAvatar,
        customerFirstName: body.customerFirstName,
        customerLastName: body.customerLastName,
        customerTelegramUsername: body.customerTelegramUsername,
      });
      return NextResponse.json(state, { headers: CORS_HEADERS });
    }

    if (action === "agree") {
      const state = await setAgreement(sender, body.messageId, {
        customerUserId: body.customerUserId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerAvatar: body.customerAvatar,
        customerFirstName: body.customerFirstName,
        customerLastName: body.customerLastName,
        customerTelegramUsername: body.customerTelegramUsername,
      });
      return NextResponse.json(state, { headers: CORS_HEADERS });
    }

    if (action === "heartbeat") {
      const meta = {
        customerUserId: body.customerUserId,
        customerName: body.customerName,
        customerFirstName: body.customerFirstName,
        customerLastName: body.customerLastName,
        customerPhone: body.customerPhone,
        customerAvatar: body.customerAvatar,
        customerTelegramUsername: body.customerTelegramUsername,
      };
      const state =
        sender === "customer"
          ? await touchCustomerPresence(meta)
          : await touchAdminPresence();
      return NextResponse.json(state, { headers: CORS_HEADERS });
    }

    if (action === "cancelAgreement") {
      const state = await cancelAgreement();
      return NextResponse.json(state, { headers: CORS_HEADERS });
    }

    if (action === "newOrder") {
      const state = await startNewOrder();
      return NextResponse.json(state, { headers: CORS_HEADERS });
    }

    if (action === "deleteMessage") {
      if (!body.messageId) {
        return NextResponse.json(
          { error: "messageId kerak" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      const state = await deleteMessage(body.messageId, sender);
      return NextResponse.json(state, { headers: CORS_HEADERS });
    }

    return NextResponse.json(
      { error: "Noto'g'ri action" },
      { status: 400, headers: CORS_HEADERS }
    );
  } catch (e) {
    console.error("[chat] POST error:", e);
    return NextResponse.json(
      { error: "Chat server xatosi" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      sender?: ChatSender;
      sketch?: SketchData;
    };
    const sender = body.sender ?? "customer";

    if (sender === "customer") {
      const auth = await requireCustomerSession();
      if (auth instanceof NextResponse) return auth;
    }

    if (body.action !== "updateSketch" || !body.sketch) {
      return NextResponse.json(
        { error: "Noto'g'ri action" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Update the shared active sketch (source of truth)
    await updateActiveSketch(body.sketch, sender);
    // Also push an explicit message so users see the updated sketch card in chat
    const state = await addMessage(sender, {
      text: "Eskiz yangilandi",
      sketch: body.sketch,
    });
    return NextResponse.json(state, { headers: CORS_HEADERS });
  } catch (e) {
    console.error("[chat] PATCH error:", e);
    return NextResponse.json(
      { error: "Eskiz saqlanmadi" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
