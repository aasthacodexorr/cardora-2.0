/*
  Finance / Express Checkout Page

  Embeds the Cardora express checkout iframe.
  Accepts an optional `inventory_id` query param
  to pre-load a specific vehicle in the checkout flow.
  Wrapped in Suspense to safely use useSearchParams.
*/

"use client";

import { Suspense, useEffect } from "react";

import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import QueryParamIframe from "@/components/common/QueryParamIframe";
const FinanceContent = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);

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
          iframe.style.height = `${value + 380}px`;
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

      <main className="bg-background my-18 mx-5 xl:mx-36 lg:mt-36">
        <section className="flex-1 w-full">
          <div className="mx-auto">
            <QueryParamIframe
              id="financing_form"
              src={`${SITE_CONFIG?.urls.financeBaseUrl}`}
              className="w-full border-0 min-h-[1039px]"
              title="Express Checkout - Finance"
              allow="payment"
              suppressHydrationWarning
            />
          </div>
        </section>
      </main>

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