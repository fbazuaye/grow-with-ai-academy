import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

function isBot() {
  if (typeof navigator === "undefined") return true;
  // @ts-expect-error - webdriver may not exist
  if (navigator.webdriver) return true;
  return /bot|crawler|spider|headless/i.test(navigator.userAgent || "");
}

function shouldTrack(path: string) {
  if (path.startsWith("/admin")) return false;
  if (path.startsWith("/api")) return false;
  if (path.startsWith("/auth")) return false;
  return true;
}

export function trackPageView(path: string, referrer?: string | null) {
  if (typeof window === "undefined") return;
  if (isBot()) return;
  if (!shouldTrack(path)) return;

  const body = JSON.stringify({ path, referrer: referrer ?? null });
  const url = "/api/public/track";

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
  } catch {
    /* fall through to fetch */
  }
  // Fallback
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function useTrackPageView() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname + (location.searchStr || "");
    if (lastPath.current === path) return;
    const ref = lastPath.current
      ? window.location.origin + lastPath.current
      : document.referrer || null;
    lastPath.current = path;
    trackPageView(path, ref);
  }, [location.pathname, location.searchStr]);
}
