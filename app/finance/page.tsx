/*
  Finance / Express Checkout Page

  Embeds the Cardora express checkout iframe.
  Accepts an optional `inventory_id` query param
  to pre-load a specific vehicle in the checkout flow.
  Wrapped in Suspense to safely use useSearchParams.
*/

"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import { Footer, Header } from "@/components/layout";
import { GetInTouch } from "@/components/common";

const FinanceContent = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);

  const searchParams = useSearchParams();
  const inventoryId = searchParams.get("inventory_id") || "";

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the Cardora iframe
      if (event.origin !== "https://cardora.zopsoftware.com") {
        return;
      }

      const { type, value, element_id } = event.data || {};

      if (
        type === "css" &&
        element_id === "financing_form" &&
        typeof value === "number"
      ) {
        const iframe = document.getElementById(
          element_id
        ) as HTMLIFrameElement | null;

        if (iframe) {
          iframe.style.height = `${value}px`;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Header />

      <main className="bg-background my-18 mx-5 xl:mx-36 lg:mt-36">
        <section className="flex-1 w-full">
          <div className="mx-auto">
            <iframe
              id="financing_form"
              src={`${SITE_CONFIG?.urls.financeBaseUrl}?inventory_id=${encodeURIComponent(
                inventoryId
              )}`}
              className="w-full border-0"
              title="Express Checkout - Finance"
              allow="payment"
            />
          </div>
        </section>
      </main>

      <GetInTouch />
      <Footer />
    </>
  );
};

export default function FinancePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-lg">
          Loading...
        </div>
      }
    >
      <FinanceContent />
    </Suspense>
  );
}