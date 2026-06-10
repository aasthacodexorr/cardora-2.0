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
import { ChevronDown, Search, FileText, MessageSquareQuote, Mail, CalendarCheck, CarFrontIcon } from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Assets
import tradeInHero from "@/assets/pages/trade-in-hero.jpg";

/*  Static Data */
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

/*  Page Component */
const TradeIn = () => {
  const [mode, setMode]       = useState<"vehicle" | "vin">("vehicle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/*  Hero / Quote form */}
      <section className="w-full relative overflow-hidden px-40 ">
      <div className="mx-auto pt-20 items-start relative z-10 flex justify-between gap-10 pb-5">
        
        {/* Left: Heading Typography Only */}
        <div className="">
          <h1 className="font-bold text-gray-950 leading-[1.08] tracking-tight text-[44px] lg:text-[66px]">
            Sell my car the<br />easy way.
          </h1>
          <p className="mt-6 text-[18px] lg:text-[23px] font-medium text-black/80 max-w-xl leading-relaxed">
            Fast,seamless and secure. It's the way everyone <br/> deserves.
          </p>
        </div>

        {/* Right: Quote Form Card matching reference image */}
        <div className="bg-white rounded-2xl shadow-xl p-8 pb-28 border border-gray-100/80 w-full max-w-[490px] lg:justify-self-end">
          
          {/* Flat Underline Mode Switcher */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode("vehicle")}
              className={`flex-1 text-center pb-3 text-[18px] font-bold transition-all relative ${
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
              className={`flex-1 text-center pb-3 text-[18px] font-bold transition-all relative ${
                mode === "vin" ? "text-gray-900" : "text-gray-900 "
              }`}
            >
              VIN
              {mode === "vin" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00b074] rounded-full" />
              )}
            </button>
          </div>

          {/* Form Context Control Fields */}
          {mode === "vehicle" ? (
            <div className="space-y-3.5">
              {["Select Year", "Select Make", "Select Model", "Select Trim"].map((label) => (
                <div key={label} className="relative">
                  <select
                    className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#00b074] cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>{label}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              ))}
              
              {/* Regional Split Inputs Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-700">
                  ontario
                </div>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-400 focus:outline-none" 
                    defaultValue=""
                  >
                    <option value="" disabled></option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <input 
                type="text" 
                placeholder="Enter 17-character VIN" 
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00b074]"
              />
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-500 focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Select Province</option>
                  <option value="ON">Ontario</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Single Action Submit Button */}
          <button className="cursor-pointer my-3 px-9 py-3 rounded-xl border border-[#00b066] bg-gradient-to-b from-[#00af66] to-[#00af66]/65 text-white text-[12px] sm:text-[14px] tracking-wider hover:opacity-90 shadow-md transition-opacity">
            Submit
          </button>
        </div>
      </div>

      {/*  Background Wave & Axis Graphic Overlays */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0">
        
        {/* Main Landscape Wave Vector */}
       <div className="absolute bottom-22 w-full">
         <svg 
          viewBox="0 0 1440 100" 
          fill="none" 
          className="w-full min-w-[1440px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,70 C340,110 520,30 720,70 C920,110 1120,50 1440,70" 
            stroke="#00b074" 
            strokeWidth="10" 
            strokeLinecap="round"
            fill="none" 
          />
        </svg>
       </div>

        {/* Center Connected Data Badge Tracker */}
        <div className="absolute bottom-0 left-1/2 -translate-x-16 flex flex-col items-center">
          
          {/* Vertical Transparent Connector Bar */}
          <div className="w-[42px] h-96 bg-gradient-to-b from-transparent via-[#00b074]/10 to-[#00b074]/20 relative flex items-end justify-center">
            {/* Center Timeline Node Circle on Wave Boundary */}
            <div className="w-7 h-7 rounded-full bg-white border-[4px] border-[#00b074] absolute bottom-[21px] z-10 shadow-sm" />
          </div>
          
          {/* Valuation Floating Popup Tag */}
          <div className="bg-[#cdf5e3] border border-[#a6e4ce] text-center px-9 py-4 rounded-xl shadow-md -translate-y-4">
            <div className="text-[10px]  text-gray-500 uppercase tracking-wider">Jan 9, 2026</div>
            <div className="text-2xl font-semibold font-black text-gray-900 mt-0.5">$18,400</div>
          </div>
        </div>

      </div>
    </section>

      {/*  How it works */}
      <section className="w-full">
        <div className="mx-auto max-w-[1300px] px-9 py-16 lg:py-20">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12 xl:min-h-180">
            {/* Left Column: Image */}
            <div className="w-full h-full">
              <img
                src={tradeInHero.src}
                alt="Customer trading in their car at Cardora"
                width={1280}
                height={1896}
                loading="lazy"
                className="h-full w-full rounded-[32px] object-cover"
              />
            </div>

            {/* Right Column: Steps */}
            <div>
              <h2 className="text-[36px] font-bold tracking-tight text-zinc-900 lg:text-[44px]">
                How it works
              </h2>

              <div className="mt-4 space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex items-start justify-between rounded-2xl border border-zinc-100 bg-white px-6 py-4 shadow-lg"
                    >
                      <div className="">
                        <h3 className="text-[22px] font-bold text-zinc-900">
                          {step.title}
                        </h3>
                        <p className="text-[17px] leading-relaxed ">
                          {step.description}
                        </p>
                      </div>

                      {/* Icon on the right side */}
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-zinc-400">
                        <Icon className="h-9 w-9 stroke-[1.5]" />
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
      <section className="w-full mb-14 mt-10">
        <div className="mx-auto max-w-[1300px]  px-9 py-16 lg:py-0">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-[36px] lg:text-[44px] font-semibold text-foreground">
              Popular sell or trade in questions
            </h2>
          </div>

          <div className="">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="bg-card border border-border overflow-hidden ">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer ${openFaq != i ? "bg-[#f4f4f4]" : null }`}
                >
                  <span className={`font-bold ${openFaq != i ? "text-[#666666]" : "text-[#333333]" } text-[20px] leading-none`}>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-foreground/60 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-foreground/70">{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* <div className="mt-12 text-center">
            <p className="text-foreground/70 mb-4">Ready to find your next ride after selling?</p>
            <Link href="/inventory">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-brand-green-foreground px-8 py-6 text-base font-bold">
                Browse all Cars
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default TradeIn;
