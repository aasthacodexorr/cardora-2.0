/* =========================
   Financing Page
   Embeds the Cardora financing application form
   via an iframe. Listens for postMessage events
   from the iframe to dynamically resize the iframe
   height, preventing scroll bars inside the embed.
========================= */

"use client";

import { useEffect, useRef, useState } from "react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Config
import { SITE_CONFIG } from "@/constants";

/*  Constants */
const MIN_HEIGHT      = 540;
const FALLBACK_HEIGHT = 900;

/*  Page Component */
const Finance = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(FALLBACK_HEIGHT);

  // Listen for height updates from the embedded financing form
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (
        data &&
        typeof data === "object" &&
        data.type === "css" &&
        data.element_id === "financing_form" &&
        typeof data.value === "number"
      ) {
        setHeight(Math.max(MIN_HEIGHT, Math.ceil(data.value) + 24));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-6 md:py-10 pb-16 mb-52 lg:mt-28">
        <div className="mx-auto max-w-[1100px] px-4 md:px-6">
          <div className="overflow-hidden">
            <iframe
              ref={iframeRef}
              id="financing_form"
              src={`${SITE_CONFIG.urls.financeRenderApiUrl}?`}
              name="iframe_a"
              title="Cardora financing application"
              scrolling="no"
              className="w-full block transition-[height] duration-300 ease-out border-0"
              style={{
                minHeight: MIN_HEIGHT,
                height: `${height}px`,
              }}
            />
          </div>
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default Finance;
