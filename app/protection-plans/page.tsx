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
import { GetInTouch, DreamVehicleCTA } from "@/components/common";

// Assets
import silverCar from "@/assets/cars/protection-car.png";
import greenCar  from "@/assets/cars/protection-green-car.png";

/* ── Static Data ────────────────────────────────────────────── */
const includes = [
  { icon: ShieldCheck, label: "6-month warranty" },
  { icon: Wrench,      label: "150-point inspection" },
  { icon: PhoneCall,   label: "Roadside assistance" },
  { icon: RefreshCw,   label: "10-day exchange" },
];

const standBehind = [
  "Detailed CarFax history report",
  "No flood or frame damage",
  "No salvage history",
  "No odometer problems",
  "Triple stage detailing",
];

const coveredSystems = [
  { icon: Cog,      label: "Engine" },
  { icon: Settings2, label: "Transmission" },
  { icon: Car,      label: "DriveTrain" },
  { icon: Cpu,      label: "Electronics" },
  { icon: Zap,      label: "Electrical systems" },
  { icon: Compass,  label: "Steering" },
  { icon: Activity, label: "Suspension" },
  { icon: Snowflake, label: "Cooling systems" },
  { icon: Wind,     label: "Climate Control" },
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

/* ── Page Component ────────────────────────────────────────── */
const ProtectionPlans = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Every Vehicle Includes ───────────────────────── */}
      <section className="bg-foreground text-background py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight">
            Every Vehicle Includes
          </h1>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {includes.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-brand-green/15 border border-brand-green/30 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-brand-green" strokeWidth={2.2} />
                </div>
                <p className="mt-4 text-base md:text-lg font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── We stand behind our cars ─────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              We stand behind our cars so much, you get:
            </h2>
            <ul className="mt-8 space-y-4">
              {standBehind.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-lg text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img src={silverCar.src} alt="Cardora certified vehicle" loading="lazy" width={1024} height={640} className="w-full max-w-[560px] h-auto" />
          </div>
        </div>
      </section>

      {/* ── How Cardora keeps you covered ───────────────── */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              How Cardora keeps you covered
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              Every plan covers major systems and parts on your car, with deductibles starting as low as $50 on any car you choose.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {coveredSystems.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-green/50 hover:shadow-md transition-all">
                <Icon className="h-8 w-8 text-brand-green" strokeWidth={2} />
                <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            What's included?
          </h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedFeatures.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:border-brand-green/40 transition-all">
                <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-brand-green" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAP Coverage ─────────────────────────────────── */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-brand-green uppercase">Optional</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Gap Coverage</h2>
            <p className="mt-5 text-base md:text-lg text-background/75 leading-relaxed">
              Life doesn't wait. If your vehicle is totaled or stolen, insurance may not cover what you still owe. GAP coverage protects you by covering the remaining balance — so you're not left paying for a car you no longer have.
            </p>
          </div>

          {/* Example scenario 1 */}
          <div className="mt-16">
            <p className="text-sm uppercase tracking-widest text-background/60 font-semibold">Example</p>
            <div className="mt-4 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <p className="text-background/70">If You Owed on Your Vehicle</p>
                <p className="text-4xl md:text-6xl font-extrabold mt-1">$15,000</p>
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-background/15 p-6">
                    <p className="text-sm text-background/70">Insurance Payout</p>
                    <p className="mt-1 text-3xl md:text-4xl font-extrabold">$11,000</p>
                  </div>
                  <div className="rounded-2xl border-2 border-brand-green bg-brand-green/10 p-6">
                    <p className="text-sm text-background/80">Amount Owed (GAP)</p>
                    <p className="mt-1 text-3xl md:text-4xl font-extrabold text-brand-green">$4,000</p>
                    <p className="mt-2 text-xs text-background/70">GAP coverage protects you from the amount still owed.</p>
                  </div>
                </div>
              </div>
              <img src={greenCar.src} alt="Vehicle with gap coverage" loading="lazy" width={1024} height={640} className="w-full max-w-[420px] h-auto justify-self-center" />
            </div>
          </div>

          {/* Example scenario 2 */}
          <div className="mt-16 pt-12 border-t border-background/15">
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              <div className="rounded-2xl border border-background/15 p-6">
                <p className="text-sm text-background/70">Insurance Payout</p>
                <p className="mt-1 text-3xl md:text-4xl font-extrabold">$15,000</p>
              </div>
              <div className="rounded-2xl border-2 border-brand-green bg-brand-green/10 p-6">
                <p className="text-sm text-background/80">Amount Owed (GAP)</p>
                <p className="mt-1 text-3xl md:text-4xl font-extrabold text-brand-green">$3,000</p>
                <p className="mt-2 text-xs text-background/70">GAP coverage protects you from the amount still owed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Cardora difference ───────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            The Cardora difference
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {differences.map((d, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-8 text-left hover:border-brand-green/40 hover:shadow-md transition-all">
                <span className="inline-flex h-10 w-10 rounded-full bg-brand-green text-white items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="mt-5 text-base md:text-lg text-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DreamVehicleCTA />
      <GetInTouch />
      <Footer />
    </div>
  );
};

export default ProtectionPlans;
