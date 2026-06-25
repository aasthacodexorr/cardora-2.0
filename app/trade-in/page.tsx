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
import { ChevronDown, FileText, Mail, CalendarCheck, CarFrontIcon,  } from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Assets
// import tradeInHero from "@/assets/pages/trade-in-hero.jpg";
import Image from "next/image";
import { SITE_CONFIG } from "@/constants";
import sell from "@/assets/pages/sell.jpg";

/* Static Data */
const steps = [
  {
    icon: CarFrontIcon,
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
    q: "How does selling my car to Dealership work?",
    a: "Dealership makes selling your car fast and easy. Simply enter your vehicle details, get an instant online offer, schedule a quick inspection, and get paid on the spot. No obligations, no pushy salespeople.",
  },
  {
    q: "What documents do I need to sell my car?",
    a: "You'll need: Valid government ID, Vehicle Ownership, All keys & fobs. If your car has a loan or lease, bring the payoff letter and we'll handle the rest.",
  },
  {
    q: "Do you buy cars that still have a loan or financing on them?",
    a: "Yes! Dealership will pay off your existing loan or lease directly with the bank. If your car is worth more than the payoff, you keep the difference. If it's worth less, we'll guide you on the best options.",
  },
  {
    q: "How long is my online offer valid for?",
    a: "Your Dealership offer is valid for 7 days. This gives you enough time to compare options or shop around without feeling rushed.",
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
    q: "Do I need to buy a car from Dealership to sell you mine?",
    a: "Not at all. We buy cars even if you're not purchasing one from us. Many customers simply want cash or want to get rid of an unused vehicle.",
  },
  {
    q: "How does Dealership determine my vehicle's value?",
    a: "We use real-time market data, vehicle history, condition reports, and recent sales in your area to give you an accurate and competitive offer. No guesswork—just transparent pricing.",
  },
  {
    q: "What if I owe more on my car than it's worth?",
    a: "This is very common. We can still buy your car. We'll calculate the shortfall and help you determine the best way to clear the loan. If trading in, you may be able to roll the balance into your next vehicle.",
  },
];

const TRADE_FORMS = {
  vehicle: {
    url: SITE_CONFIG.urls.tradeFormByVehicle,
    minHeight: 447,
  },
  vin: {
    url: SITE_CONFIG.urls.tradeFormByVin,
    minHeight: 327,
  },
} as const;

/* Page Component */
const TradeIn = () => {
  const [mode, setMode]       = useState<"vehicle" | "vin">("vehicle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero / Quote form */}
      <section className="w-full relative px-4 lg:px-24 lg:mt-24">
        <div className="mx-auto max-w-[1300px] px-2 md:px-9 pt-10 lg:pt-20 items-center lg:items-start relative z-10 flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 pb-5">

          {/* Left: Heading Typography Only */}
          <div className="w-full lg:w-auto text-left">
            <h1 className="font-bold text-gray-950 leading-[1.08] tracking-tight text-[38px] md:text-[44px] lg:text-[66px] md:w-xl">
              Sell my car the easy way.
            </h1>
            <p className="mt-4 lg:mt-6 text-[18px] lg:text-[23px] text-black max-w-xl leading-relaxed">
              Fast, seamless and secure. It's the way everyone <br className="hidden lg:inline" /> deserves.
            </p>
          </div>

          {/* Dynamic Wave, Axis Tracking Graphic and Tag for Mobile View */}
          <div className="block lg:hidden w-full relative pointer-events-none px-4">
            <div className="w-full h-[180px] relative overflow-visible flex flex-col items-center justify-center">

              {/* Background Landscape Wave Line Vector */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full flex justify-center z-10">
                <svg
                  viewBox="0 0 360 60"
                  fill="none"
                  className="w-full overflow-visible"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M -20,30 C 90,45 120,5 180,20 C 240,35 270,10 380,20"
                    stroke="#00af66"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Center Connected Data Badge Tracker Complex */}
              <div className="relative flex flex-col items-center">

                {/* Vertical Transparent Connector Bar Structure */}
                <div className="relative h-28 w-[38px] flex items-center justify-center z-0">
                  {/* Green glow background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00b074]/15 to-[#00b074]/20" />

                  {/* Main green progress line */}
                  <div className="absolute inset-y-0 w-full bg-gradient-to-b from-[#dff8ed] via-[#a8ebc9] to-[#7ee0af]" />

                  {/* White dashed center line */}
                  <div className="absolute inset-y-4 w-[2px]">
                    <div
                      className="h-full w-full opacity-80"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, white 0px, white 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                  </div>
                </div>
                

                {/* Anchor Marker Circle Dot */}
                <div className="absolute top-[37%] z-20 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-white border-[3.5px] border-[#00b074] shadow-md" />
                </div>

                {/* Valuation Floating Popup Tag matching original desktop styles */}
                <div className="bg-[#cdf5e3] text-center px-8 py-3 rounded-xl shadow-md border border-[#b2edd1]/40 mt-1 z-20">
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Jan 9, 2026</div>
                  <div className="text-xl font-black text-gray-900 mt-0.5">$18,400</div>
                </div>

              </div>

            </div>
          </div>

          {/* Right: Quote Form Card Container */}
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 pb-12 md:pb-24 border border-gray-100/80 w-full max-w-[440px] lg:justify-self-end z-10">
            <div className="flex border-b border-gray-200 mb-6 cursor-pointer">
              <button
                onClick={() => setMode("vehicle")}
                className={`flex-1 text-center pb-3 text-[16px] md:text-[18px] font-bold transition-all relative cursor-pointer ${
                  mode === "vehicle" ? "text-gray-900" : "text-gray-900"
                }`}
              >
                By Vehicle
                {mode === "vehicle" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00b074] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setMode("vin")}
                className={`flex-1 text-center pb-3 text-[16px] md:text-[18px] font-bold transition-all relative cursor-pointer ${
                  mode === "vin" ? "text-gray-900" : "text-gray-900"
                }`}
              >
                VIN
                {mode === "vin" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00b074] rounded-full" />
                )}
              </button>
            </div>

            <iframe
              key={mode}
              src={TRADE_FORMS[mode].url}
              title={mode === "vehicle" ? "Trade Form By Vehicle" : "Trade Form By VIN"}
              width="100%"
              className="border-0 cursor-pointer"
              style={{
                minHeight: `${TRADE_FORMS[mode].minHeight}px`,
              }}
            />
          </div>
        </div>

        {/* Desktop Only Background Wave & Axis Graphic Overlays */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0">
          {/* Main Landscape Wave Vector */}
          <div className="absolute bottom-30 w-full z-10">
            <svg 
              viewBox="0 0 1440 100" 
              fill="none" 
              className="w-full min-w-[1440px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0,70 C340,110 520,30 720,70 C920,110 1120,50 1440,70" 
                stroke="#00af66" 
                strokeWidth="10" 
                strokeLinecap="round"
                fill="none" 
              />
            </svg>
          </div>

          {/* Added z-10 to the main outer container to lift everything above the wave line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-16 flex flex-col items-center z-10">

            {/* Vertical Transparent Connector Bar */}
            <div className="relative h-96 w-[44px] flex items-end justify-center ">
              {/* Green glow background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-[#00b074]/15 to-[#00b074]/20" />

              {/* Main green progress line */}
              <div className="absolute inset-y-0 rounded-full bg-gradient-to-b from-[#dff8ed] via-[#a8ebc9] to-[#7ee0af]" />

              {/* White dashed center line */}
              <div className="absolute inset-y-6 w-[2px]">
                <div
                  className="h-full w-full opacity-80"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, white 0px, white 6px, transparent 6px, transparent 12px)",
                  }}
                />
              </div>
            </div>

            {/* Marker */}
            <div className="absolute bottom-[29%] z-20 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-white border-[4px] border-[#00b074] shadow-md" />
            </div>

            <div className="absolute top-full left-1/2 -mt-5 -translate-x-1/2 w-[44px] h-32 bg-gradient-to-b from-[#a8ebc9]/50 to-transparent" />

            {/* Valuation Floating Popup Tag */}
            <div className="bg-[#cdf5e3] text-center px-9 py-4 rounded-xl shadow-md -translate-y-4 z-20">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Jan 9, 2026</div>
              <div className="text-2xl font-semibold font-black text-gray-900 mt-0.5">$18,400</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full px-4 lg:pr-32 -mt-5 ml-12">
        <div className="mx-auto max-w-[1600px] px-2 md:px- py-10 lg:py-20 ml-20">
          <div className="grid grid-cols-1 items-start gap-6 lg:gap-0 lg:grid-cols-[1fr_1.1fr] lg:gap-12 xl:min-h-180">
            {/* Left Column: Image */}
            <div className="w-full h-[500px] md:h-full ml-4 ">
              <Image
                src={sell}
                alt="Customer trading in their car at Dealership"
                width={1280}
                height={1896}
                loading="lazy"
                className="h-full w-full rounded-[24px] md:rounded-[32px] object-cover"
              />
            </div>

            {/* Right Column: Steps */}
            <div className="pr-20">
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-zinc-900 lg:text-[44px]">
                How it works
              </h2>

              <div className="mt-4 space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex items-start justify-between rounded-2xl border border-zinc-100 bg-white px-4 md:px-6 py-4 shadow-lg gap-4"
                    >
                      <div>
                        <h3 className="text-[19px] md:text-[22px] font-bold text-zinc-900">
                          {step.title}
                        </h3>
                        <p className="text-[15px] md:text-[17px] leading-relaxed text-black mt-1">
                          {step.description}
                        </p>
                      </div>

                      {/* Icon on the right side */}
                      <div className="flex h-8 w-8 md:h-9 md:w-9 flex-shrink-0 items-center justify-center text-zinc-500">
                        <Icon className="h-full w-full stroke-[1.5]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full lg:mb-14 mb-2 lg:mt-10 px-3 lg:px-24">
        <div className="mx-auto max-w-[1300px] px-2 md:px-9 py-8 lg:py-0">
          <div className="flex items-center gap-3 mb-6 md:mb-10">
            <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-semibold text-foreground leading-tight">
              Popular sell or trade in questions
            </h2>
          </div>

          <div className="space-y-1">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="bg-card border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-4 md:px-6 text-left  cursor-pointer transition-colors ${
                    openFaq !== i ? "bg-[#f4f4f4]" : "bg-white"
                  }`}
                >
                  <span className={`font-bold leading-none ${openFaq !== i ? "text-[#666666]  py-5 md:py-6" : "text-[#333333] py-4 md:py-5"} text-[18px] md:text-[20px] pr-4 `}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-foreground/60 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 md:px-6 pb-5 text-[16px] md:text-[16px] leading-normal bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default TradeIn;