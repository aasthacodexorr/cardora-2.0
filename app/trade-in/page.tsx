/* =========================
   Trade-In Page
   Allows users to get a vehicle valuation offer.
   Sections:
   - Hero with quote form (By Vehicle / VIN toggle)
   - "How it works" step-by-step with image
   - FAQ accordion
   - GetInTouch → Footer
========================= */

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, FileText, MessageSquareQuote, Mail, CalendarCheck } from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Assets
import tradeInHero from "@/assets/pages/trade-in-hero.jpg";

/* ── Static Data ────────────────────────────────────────────── */
const steps = [
  {
    icon: Search,
    title: "Find your car",
    description: "Enter your VIN or vehicle details to find the car you want to sell or trade.",
  },
  {
    icon: FileText,
    title: "Tell us about your car",
    description: "Answer some quick questions about your car and its condition, and provide your details so we can contact you.",
  },
  {
    icon: Mail,
    title: "We'll send you an offer",
    description: "If no additional information is required, you'll receive our offer for your car in one business day.",
  },
  {
    icon: CalendarCheck,
    title: "Book an inspection and get paid",
    description: "If you choose to accept our offer, you can book an inspection to confirm your car's condition and get paid.",
  },
];

const faqs = [
  {
    q: "How does selling my car to Cardora work?",
    a: "Cardora makes selling your car fast and easy. Simply enter your vehicle details, get an instant online offer, schedule a quick inspection, and get paid on the spot. No obligations, no pushy salespeople.",
  },
  {
    q: "What documents do I need to sell my car?",
    a: "You'll need: Valid government ID, Vehicle Ownership, All keys & fobs. If your car has a loan or lease, bring the payoff letter and we'll handle the rest.",
  },
  {
    q: "Do you buy cars that still have a loan or financing on them?",
    a: "Yes! Cardora will pay off your existing loan or lease directly with the bank. If your car is worth more than the payoff, you keep the difference. If it's worth less, we'll guide you on the best options.",
  },
  {
    q: "How long is my online offer valid for?",
    a: "Your Cardora offer is valid for 7 days. This gives you enough time to compare options or shop around without feeling rushed.",
  },
  {
    q: "How quickly do I get paid?",
    a: "You get paid the same day you bring your car in. Payment can be made via EMT, cheque, or direct deposit—whichever is easiest for you.",
  },
  {
    q: "Can I trade in my vehicle instead of selling it?",
    a: "Yes! You can trade in your current vehicle and use the value toward your next purchase. We handle all paperwork and give you the highest value possible to maximize your savings.",
  },
  {
    q: "Do I need to buy a car from Cardora to sell you mine?",
    a: "Not at all. We buy cars even if you're not purchasing one from us. Many customers simply want cash or want to get rid of an unused vehicle.",
  },
  {
    q: "How does Cardora determine my vehicle's value?",
    a: "We use real-time market data, vehicle history, condition reports, and recent sales in your area to give you an accurate and competitive offer. No guesswork—just transparent pricing.",
  },
  {
    q: "What if I owe more on my car than it's worth?",
    a: "This is very common. We can still buy your car. We'll calculate the shortfall and help you determine the best way to clear the loan. If trading in, you may be able to roll the balance into your next vehicle.",
  },
];

/* ── Page Component ────────────────────────────────────────── */
const TradeIn = () => {
  const [mode, setMode]       = useState<"vehicle" | "vin">("vehicle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero / Quote form ────────────────────────────── */}
      <section className="w-full bg-hero-bg">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 px-6 py-16 lg:py-24 items-center">
          {/* Left: headline + estimated offer */}
          <div>
            <h1 className="font-extrabold text-foreground leading-[1.05] tracking-tight text-[44px] lg:text-[64px]">
              Sell my car the easy way.
            </h1>
            <p className="mt-6 text-[18px] lg:text-[22px] font-semibold text-foreground/80 max-w-xl">
              Fast, seamless and secure. It's the way everyone deserves.
            </p>
            <div className="mt-8 flex items-center gap-6 text-foreground">
              <div>
                <div className="text-sm font-semibold text-foreground/60">Estimated offer</div>
                <div className="text-3xl font-extrabold">$18,400</div>
              </div>
              <div className="h-10 w-px bg-foreground/20" />
              <div>
                <div className="text-sm font-semibold text-foreground/60">Valid until</div>
                <div className="text-lg font-bold">Jan 9, 2026</div>
              </div>
            </div>
          </div>

          {/* Right: quote form card */}
          <div className="bg-card rounded-2xl shadow-xl p-6 lg:p-8 border border-border">
            {/* By Vehicle / VIN toggle */}
            <div className="flex gap-2 mb-6 bg-muted rounded-full p-1">
              {(["vehicle", "vin"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
                    mode === m
                      ? "bg-brand-green text-brand-green-foreground"
                      : "text-foreground/70"
                  }`}
                >
                  {m === "vehicle" ? "By Vehicle" : "VIN"}
                </button>
              ))}
            </div>

            {/* Form fields */}
            {mode === "vehicle" ? (
              <div className="space-y-3">
                {["Select Year", "Select Make", "Select Model", "Select Trim", "Select Province"].map((label) => (
                  <div key={label} className="relative">
                    <select
                      className="w-full appearance-none bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green"
                      defaultValue=""
                    >
                      <option value="" disabled>{label}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <Input placeholder="Enter VIN (17 characters)" className="h-12" />
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Province</option>
                    <option>ON</option>
                    <option>AB</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" />
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3 mt-6">
              <Button variant="outline" className="flex-1">Back</Button>
              <Button className="flex-1 bg-brand-green hover:bg-brand-green/90 text-brand-green-foreground">
                Continue
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="w-full">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            <img
              src={tradeInHero.src}
              alt="Customer trading in their car at Cardora"
              width={1280}
              height={896}
              loading="lazy"
              className="w-full rounded-3xl object-cover shadow-lg"
            />
            <div>
              <h2 className="text-[40px] lg:text-[52px] font-extrabold text-foreground leading-tight">
                How it works
              </h2>
              <div className="mt-8 space-y-6">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {i + 1}. {step.title}
                        </h3>
                        <p className="mt-1 text-foreground/70 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────── */}
      <section className="w-full bg-review-bg">
        <div className="mx-auto max-w-[1000px] px-6 py-20">
          <div className="flex items-center gap-3 mb-10">
            <MessageSquareQuote className="h-8 w-8 text-brand-green" />
            <h2 className="text-[36px] lg:text-[44px] font-extrabold text-foreground">
              Popular sell or trade in questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-foreground text-[17px]">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-foreground/60 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-foreground/70 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-foreground/70 mb-4">Ready to find your next ride after selling?</p>
            <Link href="/inventory">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-brand-green-foreground px-8 py-6 text-base font-bold">
                Browse all Cars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default TradeIn;
