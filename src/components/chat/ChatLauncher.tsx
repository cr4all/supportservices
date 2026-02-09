"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";

const VISITOR_ID_KEY = "reddit-contact-visitor-id";

export function getStoredVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VISITOR_ID_KEY);
}

export function setStoredVisitorId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VISITOR_ID_KEY, id);
}

export function generateVisitorId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--accent-fg)] shadow-md transition hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        Start a Chat
      </button>
      {open && (
        <ChatPanel
          onClose={() => setOpen(false)}
          getVisitorId={() => getStoredVisitorId() ?? generateVisitorId()}
          setVisitorId={setStoredVisitorId}
        />
      )}
    </>
  );
}
