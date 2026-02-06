"use client";

import { useState } from "react";

export function SupportForm() {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await new Promise((r) => setTimeout(r, 600));
      setStatus("sent");
      setName("");
      setContactMethod("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-md shadow-black/5 sm:p-8 dark:shadow-none dark:ring-1 dark:ring-[var(--border)]"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="support-name"
            className="block text-sm font-medium text-[var(--muted-foreground)]"
          >
            Name <span className="font-normal opacity-75">(optional)</span>
          </label>
          <input
            id="support-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted-foreground)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="support-contact"
            className="block text-sm font-medium text-[var(--muted-foreground)]"
          >
            Contact method <span className="font-normal opacity-75">(optional)</span>
          </label>
          <input
            id="support-contact"
            type="text"
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted-foreground)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            placeholder="Email or other way to reach you"
          />
        </div>
        <div>
          <label
            htmlFor="support-message"
            className="block text-sm font-medium text-[var(--muted-foreground)]"
          >
            Message <span className="text-[var(--accent)]">*</span>
          </label>
          <textarea
            id="support-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted-foreground)]/70 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            placeholder="How can we help?"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending" || !message.trim()}
          className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send request"}
        </button>
        {status === "sent" && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Request sent. We&apos;ll get back to you soon.
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600 dark:text-red-400">
            Something went wrong. Please try again.
          </span>
        )}
      </div>
    </form>
  );
}
