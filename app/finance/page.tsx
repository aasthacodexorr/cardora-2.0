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

// Layout
import { Header, Footer } from "@/components/layout";

// Config
import { SITE_CONFIG } from "@/lib/config";

/* ── Inner component (needs useSearchParams) ─────────────────── */
const FinanceContent = () => {
  const searchParams = useSearchParams();
  const inventoryId  = searchParams.get("inventory_id") || "";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="bg-hero-bg">
        <Header />
      </div>

      <section className="flex-1 w-full">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <iframe
            src={`${SITE_CONFIG.urls.financeBaseUrl}/?inventory_id=${inventoryId}`}
            className="w-full border-0 rounded-2xl shadow-sm"
            style={{ minHeight: "calc(100vh - 200px)" }}
            title="Express Checkout - Finance"
            allow="payment"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
};

/* ── Page export: wrapped in Suspense ────────────────────────── */
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
