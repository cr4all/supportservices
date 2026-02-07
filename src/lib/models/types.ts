/**
 * Shared types for the Web Chat feature (visitor + admin).
 * Aligned with web_chat_feature_spec.md.
 */

export type SessionStatus = "active" | "closed" | "ignored";

export type MessageSender = "visitor" | "admin";

export interface IChatSession {
  _id: string;
  /** Client-generated or server-assigned; stored locally by visitor. */
  visitorId: string | null;
  /** Optional name if visitor provided it (e.g. on first message). */
  name: string | null;
  /** Optional email if visitor provided it. */
  email: string | null;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
  /** For sorting sessions by last activity. */
  lastMessageAt: Date | null;
}

export interface IChatMessage {
  _id: string;
  sessionId: string;
  sender: MessageSender;
  content: string;
  /** For admin unread indicator (visitor messages not yet read). */
  read: boolean;
  createdAt: Date;
}

export type CreateSessionInput = {
  visitorId?: string | null;
  name?: string | null;
  email?: string | null;
};

export type CreateMessageInput = {
  sessionId: string;
  sender: MessageSender;
  content: string;
};
