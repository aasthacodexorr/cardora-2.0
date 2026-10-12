"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaVehicleViewContent({
  catalogItemId,
}: {
  catalogItemId: string | number | null | undefined;
}) {
  const lastSentId = useRef<string | null>(null);

  useEffect(() => {
    if (catalogItemId == null || String(catalogItemId).trim() === "") return;

    const contentId = String(catalogItemId);
    let cancelled = false;
    let timer: number | undefined;
    let attempts = 0;

    function sendWhenReady() {
      if (cancelled || lastSentId.current === contentId) return;

      if (typeof window.fbq === "function") {
        window.fbq("track", "ViewContent", {
          content_ids: [contentId],
          content_type: "product",
        });
        lastSentId.current = contentId;
        return;
      }

      if (++attempts < 20) {
        timer = window.setTimeout(sendWhenReady, 250);
      }
    }

    sendWhenReady();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [catalogItemId]);

  return null;
}
