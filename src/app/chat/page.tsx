import type { Metadata } from "next";
import Link from "next/link";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

export const metadata: Metadata = {
  title: "Web Chat",
  description: "Secure web chat for official contact and support. No account needed.",
};

function ChatBubbleIcon() {
  return (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12 c 0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 c .09-.457-.133-.901-.467-1.226 C 3.93 16.178 3 12 c 0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="page-pattern absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg shadow-black/5 sm:p-10 dark:shadow-none">
          <div className="absolute right-4 top-4 text-[var(--accent)]/10 sm:right-8 sm:top-8">
            <ChatBubbleIcon />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              No account needed
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl font-bold tracking-tight sm:text-3xl">
              Secure Web Chat
            </h1>
            <p className="mt-3 max-w-md text-[var(--muted-foreground)] sm:text-base">
              Get in touch for official contact and support. We reply as soon as we can.
              Please don&apos;t share sensitive information.
            </p>
            <div className="mt-8">
              <ChatLauncher />
            </div>
          </div>
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to contact page
          </Link>
        </p>
      </div>
    </div>
  );
}
