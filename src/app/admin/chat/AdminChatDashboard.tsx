"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_SESSIONS_MS = 4000;
const POLL_MESSAGES_MS = 2500;
const MAX_TEXTAREA_ROWS = 5;

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface SessionItem {
  _id: string;
  visitorId: string | null;
  name: string | null;
  email: string | null;
  status: string;
  lastMessageAt: string | null;
  unreadCount?: number;
}

interface MessageItem {
  _id: string;
  sender: "visitor" | "admin";
  content: string;
  createdAt: string;
}

export function AdminChatDashboard() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [reply, setReply] = useState("");
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "error">("idle");
  const listRef = useRef<HTMLDivElement>(null);
  const sessionsPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const h = Math.min(Math.max(ta.scrollHeight, 42), MAX_TEXTAREA_ROWS * 28);
    ta.style.height = `${h}px`;
  }, []);

  const fetchSessions = useCallback(async () => {
    const res = await fetch("/api/chat/sessions");
    setSessionsLoading((prev) => (prev ? false : prev));
    if (!res.ok) return;
    const data = await res.json();
    setSessions(data);
  }, []);

  const fetchMessages = useCallback(async (sessionId: string) => {
    const res = await fetch(`/api/chat/sessions/${sessionId}/messages`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data);
  }, []);

  useEffect(() => {
    fetchSessions();
    sessionsPollRef.current = setInterval(fetchSessions, POLL_SESSIONS_MS);
    return () => {
      if (sessionsPollRef.current) {
        clearInterval(sessionsPollRef.current);
        sessionsPollRef.current = null;
      }
    };
  }, [fetchSessions]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    setSendStatus("idle");
    fetch(`/api/chat/sessions/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markRead: true }),
    }).catch(() => {});
    fetchMessages(selectedId);
    messagesPollRef.current = setInterval(() => {
      fetchMessages(selectedId);
    }, POLL_MESSAGES_MS);
    return () => {
      if (messagesPollRef.current) {
        clearInterval(messagesPollRef.current);
        messagesPollRef.current = null;
      }
    };
  }, [selectedId, fetchMessages]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [reply, adjustTextareaHeight]);

  const selectedSession = sessions.find((s) => s._id === selectedId);

  const handleSendReply = async () => {
    const text = reply.trim();
    if (!text || !selectedId || sendStatus === "sending") return;
    setReply("");
    setSendStatus("sending");
    try {
      const res = await fetch(
        `/api/chat/sessions/${selectedId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "admin", content: text }),
        }
      );
      if (!res.ok) throw new Error("Send failed");
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      setSendStatus("error");
    }
    setSendStatus("idle");
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleCloseSession = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(`/api/chat/sessions/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) =>
            s._id === selectedId ? { ...s, status: "closed" } : s
          )
        );
        setSelectedId(null);
        setMessages([]);
      }
    } catch {
      setSendStatus("error");
    }
  };

  const activeCount = sessions.filter((s) => s.status === "active").length;

  function getSessionLabel(s: SessionItem): string {
    return s.name || s.email || s.visitorId || `Session ${s._id.slice(-6)}`;
  }

  function getInitials(s: SessionItem): string {
    const label = getSessionLabel(s);
    if (s.email && s.email.includes("@")) {
      return s.email.slice(0, 2).toUpperCase();
    }
    if (s.name && s.name.length >= 2) return s.name.slice(0, 2).toUpperCase();
    if (label.length >= 2) return label.slice(0, 2).toUpperCase();
    return "?";
  }

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col sm:flex-row">
      <aside
        className={`flex w-full shrink-0 flex-col border-b border-[var(--border)] bg-[var(--card)] shadow-sm sm:w-80 sm:border-b-0 sm:border-r sm:shadow-none ${selectedId ? "max-sm:hidden" : ""}`}
      >
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--card)] to-[var(--muted)]/30 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Inbox
            </span>
            {activeCount > 0 && (
              <span className="rounded-full bg-[var(--accent)]/20 px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent)]">
                {activeCount} active
              </span>
            )}
          </div>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto p-2">
          {sessions.length === 0 && sessionsLoading && (
            <li className="flex flex-col items-center gap-4 py-12">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm text-[var(--muted-foreground)]">Loading conversations…</span>
            </li>
          )}
          {sessions.length === 0 && !sessionsLoading && (
            <li className="flex flex-col items-center gap-4 py-12 px-4 text-center">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-[var(--accent)]/10" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/50">
                  <svg className="h-8 w-8 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">No conversations yet</p>
                <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-[var(--muted-foreground)]">
                  When visitors message you from the site, they’ll show up here.
                </p>
              </div>
            </li>
          )}
          {sessions.map((s, i) => {
            const unread = (s.unreadCount ?? 0) > 0;
            const selected = selectedId === s._id;
            return (
              <li key={s._id} className="mb-1" style={{ animationDelay: `${i * 30}ms` }}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s._id)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-[var(--accent)]/15 shadow-sm ring-1 ring-[var(--accent)]/30"
                      : "hover:bg-[var(--muted)]/60"
                  } ${s.status !== "active" ? "opacity-70" : ""}`}
                >
                  {unread && (
                    <span className="absolute left-0 top-1/2 h-1.5 w-1 -translate-y-1/2 rounded-full bg-[var(--accent)] admin-unread-pulse" />
                  )}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      selected ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--muted)]"
                    }`}
                  >
                    {getInitials(s)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-[var(--foreground)]">
                        {getSessionLabel(s)}
                      </span>
                      {unread && (
                        <span className="shrink-0 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-fg)] admin-unread-pulse">
                          {s.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          s.status === "active"
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {s.status}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {formatRelativeTime(s.lastMessageAt)}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <main
        className={`flex min-h-0 flex-1 flex-col bg-[var(--muted)]/30 ${!selectedId ? "max-sm:hidden" : ""}`}
      >
        {!selectedId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent)]/10 to-transparent" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] shadow-sm">
                <svg className="h-12 w-12 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
            </div>
            <div className="max-w-xs text-center">
              <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[var(--foreground)]">
                Pick a conversation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Select someone from the inbox to read the thread and reply.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="sm:hidden shrink-0 rounded-lg p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  aria-label="Back to inbox"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </button>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-semibold text-[var(--accent)]">
                  {selectedSession ? getInitials(selectedSession) : "?"}
                </div>
                <div>
                  <p className="truncate font-semibold text-[var(--foreground)]">
                    {selectedSession ? getSessionLabel(selectedSession) : "Visitor"}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        selectedSession?.status === "active"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {selectedSession?.status}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {formatRelativeTime(selectedSession?.lastMessageAt ?? null)}
                    </span>
                  </div>
                </div>
              </div>
              {selectedSession?.status === "active" && (
                <button
                  type="button"
                  onClick={handleCloseSession}
                  className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-medium transition hover:bg-[var(--muted)]"
                >
                  Close session
                </button>
              )}
            </div>

            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scroll-smooth sm:px-6"
            >
              <div className="mx-auto max-w-2xl">
                <ul className="space-y-5">
                  {messages.length === 0 && (
                    <li className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50 py-16 text-center">
                      <p className="text-sm font-medium text-[var(--foreground)]">No messages yet</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Send a reply below to start the conversation.
                      </p>
                    </li>
                  )}
                  {messages.map((m) => (
                    <li
                      key={m._id}
                      className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[88%] flex-col sm:max-w-md ${m.sender === "admin" ? "items-end" : "items-start"}`}
                      >
                        <span className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                          {m.sender === "admin" ? "You" : "Visitor"}
                        </span>
                        <span
                          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm ${
                            m.sender === "admin"
                              ? "rounded-br-md bg-[var(--accent)] text-[var(--accent-fg)] shadow-md shadow-[var(--accent)]/20"
                              : "rounded-bl-md border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                          }`}
                        >
                          {m.content}
                        </span>
                        <span className="mt-1.5 px-1.5 text-[10px] text-[var(--muted-foreground)]">
                          {formatMessageTime(m.createdAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedSession?.status === "active" && (
              <div className="shrink-0 border-t border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_-4px_12px_-4px_rgba(0,0,0,.06)] dark:shadow-[0_-4px_12px_-4px_rgba(0,0,0,.2)] sm:px-4">
                {sendStatus === "error" && (
                  <p className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                    Failed to send. Try again.
                  </p>
                )}
                <div className="mx-auto flex max-w-2xl items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleReplyKeyDown}
                    placeholder="Type a reply…"
                    rows={1}
                    className="min-h-[2.75rem] max-h-[8rem] flex-1 resize-none overflow-y-auto rounded-xl border-2 border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm placeholder-[var(--muted-foreground)]/70 transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    disabled={sendStatus === "sending"}
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={!reply.trim() || sendStatus === "sending"}
                    className="shrink-0 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] shadow-md shadow-[var(--accent)]/25 transition hover:opacity-90 disabled:opacity-50"
                  >
                    {sendStatus === "sending" ? "…" : "Send"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
