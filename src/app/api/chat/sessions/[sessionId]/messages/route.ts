import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { ChatSession, ChatMessage } from "@/lib/models";

type Params = Promise<{ sessionId: string }>;

/** GET: List messages for a session. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { sessionId } = await params;
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: "Invalid session id" }, { status: 400 });
    }
    await connectDb();
    const messages = await ChatMessage.find({
      sessionId: new mongoose.Types.ObjectId(sessionId),
    })
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json(
      messages.map((m) => ({
        _id: m._id.toString(),
        sessionId: m.sessionId.toString(),
        sender: m.sender,
        content: m.content,
        read: m.read,
        createdAt: m.createdAt,
      }))
    );
  } catch (e) {
    console.error("GET /api/chat/sessions/[sessionId]/messages", e);
    return NextResponse.json(
      { error: "Failed to list messages" },
      { status: 500 }
    );
  }
}

/** POST: Send a message (visitor or admin). */
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { sessionId } = await params;
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: "Invalid session id" }, { status: 400 });
    }
    await connectDb();
    const body = await request.json();
    const sender = body.sender === "admin" ? "admin" : "visitor";
    const content =
      typeof body.content === "string" ? body.content.trim() : "";
    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.status !== "active") {
      return NextResponse.json(
        { error: "Session is no longer active" },
        { status: 400 }
      );
    }

    const message = await ChatMessage.create({
      sessionId: new mongoose.Types.ObjectId(sessionId),
      sender,
      content,
      read: false,
    });

    await ChatSession.findByIdAndUpdate(sessionId, {
      lastMessageAt: message.createdAt,
    });

    return NextResponse.json({
      _id: message._id.toString(),
      sessionId,
      sender: message.sender,
      content: message.content,
      read: message.read,
      createdAt: message.createdAt,
    });
  } catch (e) {
    console.error("POST /api/chat/sessions/[sessionId]/messages", e);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
