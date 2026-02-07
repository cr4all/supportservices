import mongoose from "mongoose";
import type { MessageSender } from "./types";

export interface ChatMessageDoc extends mongoose.Document {
  sessionId: mongoose.Types.ObjectId;
  sender: MessageSender;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema<ChatMessageDoc>(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },
    sender: { type: String, enum: ["visitor", "admin"], required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatMessage =
  (mongoose.models.ChatMessage as mongoose.Model<ChatMessageDoc>) ??
  mongoose.model<ChatMessageDoc>("ChatMessage", chatMessageSchema);
