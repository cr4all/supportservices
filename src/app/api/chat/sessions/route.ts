import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ChatSession, ChatMessage } from "@/lib/models";

/** POST: Create a new chat session (visitor). */
export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = await request.json();
    const visitorId =
      typeof body.visitorId === "string" ? body.visitorId : null;

    const session = await ChatSession.create({
      visitorId: visitorId || null,
      status: "active",
    });

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
    console.error("POST /api/chat/sessions", e);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

/** GET: List sessions (admin) or find by visitorId (visitor). */
export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");

    if (visitorId) {
      const session = await ChatSession.findOne({
        visitorId,
        status: "active",
      })
        .sort({ updatedAt: -1 })
        .lean();
      if (!session) {
        return NextResponse.json(null, { status: 404 });
      }
      const unreadCount = await ChatMessage.countDocuments({
        sessionId: session._id,
        sender: "admin",
        read: false,
      });
      return NextResponse.json({
        _id: session._id.toString(),
        visitorId: session.visitorId,
        name: session.name,
        email: session.email,
        status: session.status,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        lastMessageAt: session.lastMessageAt,
        unreadCount,
      });
    }

    const sessionIds = (
      await ChatSession.find()
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .select("_id")
        .lean()
    ).map((s) => s._id);
    const unreadCounts = await ChatMessage.aggregate([
      { $match: { sessionId: { $in: sessionIds }, sender: "visitor", read: false } },
      { $group: { _id: "$sessionId", count: { $sum: 1 } } },
    ]);
    const unreadMap = new Map(
      unreadCounts.map((u) => [u._id.toString(), u.count])
    );
    const sessions = await ChatSession.find()
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();
    return NextResponse.json(
      sessions.map((s) => ({
        _id: s._id.toString(),
        visitorId: s.visitorId,
        name: s.name,
        email: s.email,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        lastMessageAt: s.lastMessageAt,
        unreadCount: unreadMap.get(s._id.toString()) ?? 0,
      }))
    );
  } catch (e) {
    console.error("GET /api/chat/sessions", e);
    return NextResponse.json(
      { error: "Failed to list sessions" },
      { status: 500 }
    );
  }
}
