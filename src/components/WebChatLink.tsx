"use client";

import { useCallback, useEffect, useState } from "react";
import { getStoredVisitorId } from "@/components/chat/ChatLauncher";

export function WebChatLink() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  const fetchUnread = useCallback(() => {
    const visitorId = getStoredVisitorId();
    if (!visitorId) {
      setUnreadCount(0);
      return;
    }
    fetch(`/api/chat/sessions?visitorId=${encodeURIComponent(visitorId)}`)
      .then((res) => {
        if (res.status === 404) {
          setUnreadCount(0);
          return;
        }
        if (!res.ok) {
          setUnreadCount(0);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      })
      .catch(() => setUnreadCount(0));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const visitorId = getStoredVisitorId();
    if (!visitorId) {
      setUnreadCount(0);
      return;
    }
    fetch(`/api/chat/sessions?visitorId=${encodeURIComponent(visitorId)}`)
      .then((res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setUnreadCount(0);
          return;
        }
        if (!res.ok) {
          setUnreadCount(0);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      })
      .catch(() => {
        if (!cancelled) setUnreadCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchUnread();
    };
    const onPageShow = () => fetchUnread();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [fetchUnread]);

  const showBadge = unreadCount !== null && unreadCount > 0;

  return (
    <p className="mt-5">
      <a
        href="/chat"
        className="inline-flex items-center gap-2 text-sm font-medium underline opacity-90 hover:opacity-100"
      >
        Start Secure Support Chat
        {showBadge && (
          <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-white/25 px-1.5 py-0.5 text-xs font-semibold tabular-nums">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        →
      </a>
    </p>
  );
}
