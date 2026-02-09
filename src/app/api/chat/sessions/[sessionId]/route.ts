import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { ChatSession, ChatMessage } from "@/lib/models";

type Params = Promise<{ sessionId: string }>;

/** GET: Fetch a single session. */
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
    const session = await ChatSession.findById(sessionId).lean();
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({
      _id: session._id.toString(),
      visitorId: session.visitorId,
      name: session.name,
      email: session.email,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lastMessageAt: session.lastMessageAt,
    });
  } catch (e) {
    console.error("GET /api/chat/sessions/[sessionId]", e);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

/** PATCH: Update session (e.g. close, set status) and optionally mark messages read. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { sessionId } = await params;
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: "Invalid session id" }, { status: 400 });
    }
    await connectDb();
    const body = await request.json().catch(() => ({}));
    const updates: { status?: string; name?: string | null; email?: string | null } = {};
    if (["active", "closed", "ignored"].includes(body.status)) {
      updates.status = body.status;
    }
    if (typeof body.name === "string") {
      updates.name = body.name.trim() || null;
    }
    if (typeof body.email === "string") {
      updates.email = body.email.trim() || null;
    }

    const session = await ChatSession.findByIdAndUpdate(
      sessionId,
      Object.keys(updates).length ? updates : undefined,
      { new: true }
    ).lean();
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (body.markRead === true) {
      await ChatMessage.updateMany(
        { sessionId: new mongoose.Types.ObjectId(sessionId), sender: "visitor" },
        { read: true }
      );
    }
    // Mark admin messages as read when visitor views the chat (clears main-page badge).
    if (body.markAdminMessagesRead === true) {
      await ChatMessage.updateMany(
        { sessionId: new mongoose.Types.ObjectId(sessionId), sender: "admin" },
        { read: true }
      );
    }

    return NextResponse.json({
      _id: session._id.toString(),
      visitorId: session.visitorId,
      name: session.name,
      email: session.email,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lastMessageAt: session.lastMessageAt,
    });
  } catch (e) {
    console.error("PATCH /api/chat/sessions/[sessionId]", e);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
