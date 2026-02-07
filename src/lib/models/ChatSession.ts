import mongoose from "mongoose";
import type { SessionStatus } from "./types";

export interface ChatSessionDoc extends mongoose.Document {
  visitorId: string | null;
  name: string | null;
  email: string | null;
  status: SessionStatus;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const chatSessionSchema = new mongoose.Schema<ChatSessionDoc>(
  {
    visitorId: { type: String, default: null, index: true },
    name: { type: String, default: null },
    email: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "closed", "ignored"],
      default: "active",
    },
    lastMessageAt: { type: Date, default: null },
  },
  { timestamps: true }
);

chatSessionSchema.index({ status: 1, lastMessageAt: -1 });
chatSessionSchema.index({ visitorId: 1, status: 1 });

export const ChatSession =
  (mongoose.models.ChatSession as mongoose.Model<ChatSessionDoc>) ??
  mongoose.model<ChatSessionDoc>("ChatSession", chatSessionSchema);
