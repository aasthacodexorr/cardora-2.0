/* =========================
   Protection Plans Page
   Showcases Cardora's vehicle protection offerings.
   Sections:
   - "Every Vehicle Includes" feature grid
   - "We stand behind our cars" checklist + image
   - "How Cardora keeps you covered" systems grid
   - "What's included?" feature cards
   - GAP Coverage explanation with example scenarios
   - "The Cardora difference" numbered cards
   - DreamVehicleCTA → GetInTouch → Footer
========================= */

"use client";

import {
  Check, ShieldCheck, Wrench, PhoneCall, RefreshCw,
  Cog, Settings2, Car, Cpu, Zap, Compass, Activity,
  Snowflake, Wind, MapPin, KeyRound, Truck, Wallet,
} from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Assets
import rotateCar from "@/assets/cars/rotate-car.png";
import greenCar from "@/assets/cars/green-car.png";
import { CardoraDifference } from "@/components/home";
import Image from "next/image";

/* Static Data */
const includes = [
  { icon: ShieldCheck, label: "6-month warranty" },
  { icon: Wrench, label: "150-point inspection" },
  { icon: PhoneCall, label: "Roadside assistance" },
  { icon: RefreshCw, label: "10-day exchange" },
];

const standBehind = [
  "Detailed CarFax history report",
  "No flood or frame damage",
  "No salvage history",
  "No odometer problems",
  "Triple stage detailing",
];

const coveredSystems = [
  { icon: Cog, label: "Engine" },
  { icon: Settings2, label: "Transmission" },
  { icon: Car, label: "DriveTrain" },
  { icon: Cpu, label: "Electronics" },
  { icon: Zap, label: "Electrical systems" },
  { icon: Compass, label: "Steering" },
  { icon: Activity, label: "Suspension" },
  { icon: Snowflake, label: "Cooling systems" },
  { icon: Wind, label: "Climate Control" },
];

const includedFeatures = [
  {
    icon: Truck,
    title: "24/7 roadside assistance & towing",
    body: "Help is always a call away. Roadside and towing services are available 365 days a year and start the moment your warranty plan begins.",
  },
  {
    icon: MapPin,
    title: "Nationwide protection",
    body: "Drive with confidence knowing you're protected across Canada and the United States.",
  },
  {
    icon: Car,
    title: "Rental car coverage",
    body: "If your vehicle needs a covered repair, we help cover the cost of a rental vehicle—up to $40 per day.",
  },
  {
    icon: Wallet,
    title: "No out-of-pocket costs",
    body: "Save $100 on your deductible when your repairs are completed at one of Cardora Service Center.",
  },
  {
    icon: KeyRound,
    title: "Lost Key & Lockout Assistance",
    body: "Locked out or misplaced your keys? Your warranty plan helps cover the cost of locksmith services.",
  },
];

const differences = [
  "Upfront prices, Cardora Certified quality, and detailed history reports on every car",
  "Shop online, in-store, or both. We provide no-pressure help along the way.",
  "6-month or 10,000 km limited warranty (whichever comes first)",
];

/* Page Component */
const ProtectionPlans = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-0 md:pt-24 overflow-hidden bg-white px-4 lg:px-0">
        <div className="mx-auto max-w-[1280px] px-6 md:px-1 flex flex-col lg:flex-row lg:items-center justify-between min-h-[450px]">

          {/* Left Column: Title and Pills */}
          <div className="flex flex-col justify-center space-y-6 max-w-md pb-12 md:pb-16 z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-tight md:w-xl">
              Every Vehicle Includes
            </h1>

            <div className="flex flex-col gap-4 pt-4">
              {includes.map(({ label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-[#e6f4ff] rounded-full px-5 py-4 w-full sm:w-96 shadow-[0_2px_18px_rgba(0,0,0,0.05)]"
                >
                  <Check className="h-6 w-6 text-emerald-500 shrink-0" strokeWidth={2} />
                  <span className="text-base font-medium text-neutral-800">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Car Image */}
          <div className="w-full lg:absolute lg:bottom-0 lg:right-0 lg:w-1/2 lg:w-[55%] flex justify-end items-end pointer-events-none">
            <Image
              src={rotateCar}
              alt="Silver Toyota Camry Sedan"
              loading="eager"
              className="object-contain w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[480px] object-bottom"
            />
          </div>

        </div>
      </section>

      {/* Section 2: We stand behind our cars (Full-Bleed Background, Centered Content) */}
      <section className="w-full bg-[#e6f4ff] border-t border-neutral-100/60 py-16 md:py-20 mt-20">
        <div className="mx-auto max-w-[1280px] px-6 md:px-1 flex flex-col items-center text-center">

          <h2 className="text-2xl md:text-5xl font-bold text-neutral-900 leading-none">
            We stand behind our cars<br />so much, you get:
          </h2>

          {/* Full-width List Table style layout */}
          <div className="mt-14 w-full max-w-xl divide-y divide-blue-100/80 border-t border-b border-blue-100/80">
            {standBehind.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3.5 text-left"
              >
                <span className="text-base font-medium text-neutral-800">{item}</span>
                <Check className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How Cardora keeps you covered (Full-Bleed Background, Centered Content) */}
      <section className="bg-[#eaeff5] py-16 md:py-20 px-4 lg:px-0">
        <div className="mx-auto max-w-[1280px] px-6 md:px-1">
          <div>
            <h2 className="text-3xl md:text-[45px] font-semibold tracking-tight text-foreground">
              How Cardora keeps you covered
            </h2>
            <p className="mt-4 text-black text-base max-w-2xl">
              Every plan covers major systems and parts on your car, with deductibles starting as low as $50 on any car you choose.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {coveredSystems.map(({ icon: Icon, label }) => (
              <div key={label} className="w-full bg-card border border-[#00b066] rounded-xl hover:bg-[#00af66a6] text-[#00b066] hover:text-white cursor-pointer px-4 py-3 flex items-center justify-center gap-3 transition-all">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                <p className="mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included (Full-Bleed Background, Centered Content) */}
      <section className="py-16 bg-[#eaeff5] px-4 lg:px-0">
        <div className="mx-auto max-w-[1280px] px-6 md:px-1 pb-10">
          <h2 className="text-start text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            What's included?
          </h2>
          <div className="mt-7 grid md:grid-cols-2 gap-7">
            {includedFeatures.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl py-2 transition-all flex justify-start items-start gap-4">
                <div className="max-h-8 max-w-8 p-1 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                  <Check className="text-white w-4 h-4" strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-base leading-6 text-neutral-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAP Coverage */}
      <section className="text-gray-900 pt-18 py-1 px-4 font-sans ">
        <div className="max-w-[1280px] mx-auto px-6 md:px-1 text-center">
          {/* Header Section */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">
            Gap Coverage
          </h2>
          <div className="mt-2">
            <span className="inline-block bg-[#e6f4ff] text-base px-8 py-3 rounded-full uppercase tracking-wider shadow-[0_2px_18px_rgba(0,0,0,0.05)] ">
              Optional
            </span>
          </div>
          <p className="mt-4 text-base mx-auto max-w-5xl leading-relaxed">
            Life doesn't wait. If your vehicle is totaled or stolen, insurance may not cover what you still owe. 
            GAP coverage protects you by covering the remaining balance — so you're not left paying for a 
            car you no longer have.
          </p>

          {/* Breakdown Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <span className="uppercase tracking-wide font-bold block mb-1">
              Example
            </span>
            <p className="text-xl font-normal my-1 ">If You Owed on Your Vehicle</p>
            <p className="text-3xl md:text-3xl font-black text-emerald-600 mt-1">$15,000</p>
            
            <hr className="mt-12 border-gray-300 mx-auto" />

            <div className="grid grid-cols-2 gap-4 mx-auto items-start text-center ">
              {/* Left Column: Payout */}
              <div className="pt-10">
                <p className="text-lg font-bold text-gray-800">Insurance Payout</p>
                <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">$11,000</p>
              </div>

              {/* Right Column: Gap */}
              <div className="border-l border-gray-300 pl-10 pt-10">
                <p className="text-lg font-bold text-gray-800">Amount Owed (GAP)</p>
                <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">$4,000</p>
                <p className="mt-2 text-md mx-auto leading-normal">
                  GAP coverage protects you from the amount still owed.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Asset Graphic */}
          <div className="mt-10 flex justify-center">
            <Image 
              src={greenCar} 
              alt="Vehicle visualization split with checklist indicators" 
              className="w-full h-auto max-w-4xl"
            />
          </div>
        </div>
      </section>

      {/* The Cardora Difference Section */}
      <div className="w-full mx-auto px-6 md:px-1 -mt-20">
        <CardoraDifference />
      </div>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default ProtectionPlans;