"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 2500;
const MAX_TEXTAREA_ROWS = 6;

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export interface ChatMessage {
  _id: string;
  sessionId: string;
  sender: "visitor" | "admin";
  content: string;
  read: boolean;
  createdAt: string;
}

interface ChatPanelProps {
  onClose: () => void;
  getVisitorId: () => string;
  setVisitorId: (id: string) => void;
}

export function ChatPanel({
  onClose,
  getVisitorId,
  setVisitorId,
}: ChatPanelProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "sending" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const contactInfoSentRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const h = Math.min(Math.max(ta.scrollHeight, 42), MAX_TEXTAREA_ROWS * 28);
    ta.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  const ensureSession = useCallback(async () => {
    const visitorId = getVisitorId();
    if (!visitorId) return;
    setVisitorId(visitorId);

    const res = await fetch(
      `/api/chat/sessions?visitorId=${encodeURIComponent(visitorId)}`
    );
    if (res.ok) {
      const data = await res.json();
      setSessionId(data._id);
      return data._id;
    }
    if (res.status === 404) {
      const createRes = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });
      if (!createRes.ok) {
        setStatus("error");
        setErrorMessage("Could not start chat.");
        return null;
      }
      const data = await createRes.json();
      setSessionId(data._id);
      return data._id;
    }
    setStatus("error");
    setErrorMessage("Could not load chat.");
    return null;
  }, [getVisitorId, setVisitorId]);

  const fetchMessages = useCallback(async (sid: string) => {
    const res = await fetch(`/api/chat/sessions/${sid}/messages`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sid = await ensureSession();
      if (cancelled || !sid) return;
      await fetchMessages(sid);
      setStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureSession, fetchMessages]);

  useEffect(() => {
    if (!sessionId || status !== "ready") return;
    fetchMessages(sessionId);
    pollRef.current = setInterval(() => {
      fetchMessages(sessionId);
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [sessionId, status, fetchMessages]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !sessionId || status === "sending") return;
    setInput("");
    setStatus("sending");
    setErrorMessage(null);
    const wasFirstMessage = messages.length === 0;
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "visitor", content: text }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || "Failed to send.");
        setStatus("ready");
        return;
      }
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      if (wasFirstMessage) {
        setShowContactPopup(true);
      }
    } catch {
      setErrorMessage("Failed to send.");
    }
    setStatus("ready");
  };

  const submitContactPopup = () => {
    if (!sessionId || contactInfoSentRef.current) {
      setShowContactPopup(false);
      return;
    }
    if (name.trim() || email.trim()) {
      contactInfoSentRef.current = true;
      fetch(`/api/chat/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      }).catch(() => {});
    }
    setShowContactPopup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSending = status === "sending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-label="Secure Support - How can we help?"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-full max-w-lg flex-col rounded-t-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl ring-1 ring-black/5 transition-all duration-200 sm:h-[32rem] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/50 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12 c 0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 c .09-.457-.133-.901-.467-1.226 C 3.93 16.178 3 12 c 0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold">Secure Support - How can we help?</h2>
              <p className="text-[10px] text-[var(--muted-foreground)]">Official support • Replies as soon as possible</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close chat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="shrink-0 border-b border-[var(--border)] px-4 py-2 text-xs text-[var(--muted-foreground)]">
          Our security team is here to assist you.
        </p>

        {status === "loading" && (
          <div className="flex flex-1 items-center justify-center p-4">
            <span className="text-sm text-[var(--muted-foreground)]">
              Starting chat…
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setErrorMessage(null);
                ensureSession();
              }}
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)]"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && sessionId && (
          <>
            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-3 scroll-smooth"
            >
              <ul className="space-y-4">
                {messages.length === 0 && (
                  <li className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-[var(--muted)] p-3 text-[var(--accent)]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12 c 0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 c .09-.457-.133-.901-.467-1.226 C 3.93 16.178 3 12 c 0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-medium text-[var(--foreground)]">Start the conversation</p>
                    <p className="mt-1 max-w-[220px] text-xs text-[var(--muted-foreground)]">
                      Type your message below. We&apos;ll reply as soon as we can.
                    </p>
                  </li>
                )}
                {messages.map((m) => (
                  <li
                    key={m._id}
                    className={`flex ${m.sender === "visitor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[85%] flex-col ${m.sender === "visitor" ? "items-end" : "items-start"}`}
                    >
                      <span className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                        {m.sender === "visitor" ? "You" : "Support"}
                      </span>
                      <span
                        className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          m.sender === "visitor"
                            ? "rounded-br-md bg-[var(--accent)] text-[var(--accent-fg)]"
                            : "rounded-bl-md bg-[var(--muted)] text-[var(--foreground)]"
                        }`}
                      >
                        {m.content}
                      </span>
                      <span className="mt-1 px-1 text-[10px] text-[var(--muted-foreground)]">
                        {formatMessageTime(m.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {errorMessage && (
              <p className="shrink-0 px-4 pb-1 text-xs text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            )}

            <div className="shrink-0 border-t border-[var(--border)] p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  rows={1}
                  className="min-h-[2.5rem] max-h-[9rem] flex-1 resize-none overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm placeholder-[var(--muted-foreground)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                  disabled={isSending}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="shrink-0 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}

        {status === "sending" && sessionId && (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3" />
            <div className="shrink-0 border-t border-[var(--border)] p-3">
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2.5 text-sm text-[var(--muted-foreground)]">
                  Sending…
                </div>
                <button
                  type="button"
                  disabled
                  className="shrink-0 rounded-xl bg-[var(--accent)]/50 px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)]"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}

        {showContactPopup && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-t-2xl rounded-b-2xl bg-black/50 p-4 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Add your contact? (optional)
              </h3>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                So we can follow up if needed.
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="popup-chat-name"
                    className="block text-xs text-[var(--muted-foreground)]"
                  >
                    Name
                  </label>
                  <input
                    id="popup-chat-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm placeholder-[var(--muted-foreground)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="popup-chat-email"
                    className="block text-xs text-[var(--muted-foreground)]"
                  >
                    Email
                  </label>
                  <input
                    id="popup-chat-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm placeholder-[var(--muted-foreground)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20"
                  />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowContactPopup(false)}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)]/50"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={submitContactPopup}
                  className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
