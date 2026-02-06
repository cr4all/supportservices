"use client";

import { env } from "@/lib/env";

export function OpenInAppButton({ variant = "default" }: { variant?: "default" | "inverted" }) {
  const handleClick = () => {
    const { appDeepLink, appStoreUrl, playStoreUrl } = env;
    const isProbablyAndroid = /Android/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : ""
    );
    const storeUrl = isProbablyAndroid ? playStoreUrl : appStoreUrl;

    if (typeof window === "undefined") return;
    if (!appDeepLink && !storeUrl) return;

    const start = Date.now();
    const timeout = 1500;
    const handleBlur = () => {
      if (Date.now() - start < timeout) {
        document.removeEventListener("visibilitychange", handleBlur);
      }
    };
    if (appDeepLink) {
      document.addEventListener("visibilitychange", handleBlur);
      window.location.href = appDeepLink;
    }
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleBlur);
      if (storeUrl) window.location.href = storeUrl;
    }, appDeepLink ? timeout : 0);
  };

  const isInverted = variant === "inverted";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        isInverted
          ? "group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-[var(--accent)] shadow-lg transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--accent)] sm:w-auto"
          : "group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--accent)] px-6 py-4 text-base font-semibold text-[var(--accent-fg)] shadow-lg shadow-[var(--accent)]/25 transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 sm:w-auto"
      }
    >
      <span className={`flex size-5 items-center justify-center rounded-md ${isInverted ? "bg-[var(--accent)]/15" : "bg-white/20"}`}>
        <svg className={isInverted ? "size-3.5 text-[var(--accent)]" : "size-3.5 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </span>
      Open in App
    </button>
  );
}
