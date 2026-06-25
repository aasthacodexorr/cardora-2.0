/* =========================
   Finance / Express Checkout Page
   Embeds the Cardora express checkout iframe.
   Accepts an optional `inventory_id` query param
   to pre-load a specific vehicle in the checkout flow.
   Wrapped in Suspense to safely use useSearchParams.
========================= */

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Config
import { SITE_CONFIG } from "@/constants";
import { Footer, Header } from "@/components/layout";
import { GetInTouch } from "@/components/common";

/*  Inner component (needs useSearchParams) */
const FinanceContent = () => {
  const searchParams = useSearchParams();
  const inventoryId  = searchParams.get("inventory_id") || "";

  return (
    <>
    <Header/>
    <main className="bg-background  my-18 mx-5 xl:mx-36 overflow-hidden lg:mt-40">
      <section className="flex-1 w-full">
        <div className="mx-auto max-w-[1400px">
          <iframe
            src={`${SITE_CONFIG?.urls.financeBaseUrl}?inventory_id=${inventoryId}`}
            className="w-full border-0 rounded-2xl min-h-screen"
            title="Express Checkout - Finance"
            allow="payment"
          />
        </div>
      </section>
    </main>
    <GetInTouch/>
    <Footer/>
    </>
  );
};

/*  Page export: wrapped in Suspense */
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
