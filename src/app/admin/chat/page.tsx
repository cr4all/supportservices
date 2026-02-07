import type { Metadata } from "next";
import Link from "next/link";
import { AdminChatDashboard } from "./AdminChatDashboard";

export const metadata: Metadata = {
  title: "Admin – Web Chat",
  description: "Manage visitor chat sessions.",
};

export default function AdminChatPage() {
  return (
    <div className="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative shrink-0 overflow-hidden border-b border-[var(--border)] bg-[var(--card)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--accent)/.08_0%,transparent_50%,var(--accent)/.04_100%)]" />
        <div className="relative flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]/80 hover:text-[var(--foreground)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-fraunces)] text-lg font-semibold tracking-tight sm:text-xl">
              Admin Chat
            </span>
            <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
              Live
            </span>
          </div>
          <div className="w-16 sm:w-20" />
        </div>
      </header>
      <div className="min-h-0 flex-1">
        <AdminChatDashboard />
      </div>
    </div>
  );
}
