"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/config";

const FinanceContent = () => {
  const searchParams = useSearchParams();
  const inventoryId = searchParams.get("inventory_id") || "";

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

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>}>
      <FinanceContent />
    </Suspense>
  );
}
