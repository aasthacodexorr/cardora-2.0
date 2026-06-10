/* =========================
   Service Page
   Cardora's vehicle service & repair page.
   Sections:
   - Hero with schedule CTA
   - Location & booking cards
   - "Take care of your ride" service grid
   - Additional services grid
   - "Hit the road with confidence" trust highlights
   - DreamVehicleCTA → GetInTouch → Footer
========================= */

"use client";

import {
  Phone, MapPin, CalendarCheck,
  Droplets, Disc3, Gauge, BatteryCharging, Wrench,
  Stethoscope, ThermometerSun, AlertCircle, Cog, Compass,
  Star, Clock, ShieldCheck,
} from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch, DreamVehicleCTA } from "@/components/common";

// UI
import { Button } from "@/components/ui/button";

// Config
import { SITE_CONFIG } from "@/lib/config";
import { PHONE_HREF, PHONE_NUMBER } from "@/constants";
import locationIcon from "@/assets/icons/location.png";
import mapIcon from "@/assets/icons/map-c.png";

/*  Static Data */
const mainServices = [
  { icon: Droplets,       title: "Oil Change & Lube",       body: "Engine oil change, filter, reset oil light" },
  { icon: Disc3,          title: "Tire & Wheel Service",    body: "Replacement, flat, rotation, alignment" },
  { icon: Gauge,          title: "Brakes",                  body: "Issues, pads, rotors, calipers" },
  { icon: BatteryCharging, title: "Battery",                body: "Charge, replacement, testing, starter" },
  { icon: Wrench,         title: "Scheduled Maintenance",   body: "Manufacturer service intervals" },
];

const additionalServices = [
  { icon: Stethoscope,   label: "General Diagnosis" },
  { icon: ThermometerSun, label: "AC / Heating" },
  { icon: AlertCircle,   label: "Check Engine Light" },
  { icon: Cog,           label: "Powertrain & Engine" },
  { icon: Compass,       label: "Steering & Suspension" },
];

const trustHighlights = [
  {
    icon: Star,
    title: "Trusted by Our Customers",
    body: "Our certified repair centre is known for exceptional service, backed by genuine customer reviews and high satisfaction ratings.",
  },
  {
    icon: Clock,
    title: "Convenient After-Hours Drop-Off",
    body: "Busy schedule? No problem. Drop off your vehicle before or after business hours—on your time, not ours.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Repairs. No Pressure.",
    body: "We only recommend what your vehicle truly needs. Expect transparent pricing, clear explanations, and absolutely no unnecessary add-ons.",
  },
];

/*  Page Component */
const Service = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/*  Hero */}
      <section className="pt-16 md:pt-24 pb-10 ">
        <div className="mx-auto px-28 text-start">
          <p className="text-base md:text-xl">
            Service & Repairs
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[60px]">
            Quality Repairs,<br />
            Prices you can Trust. 
          </h1>
        </div>
      </section>

      {/*  Location & booking */}
      <section id="book" className="py-1">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-2 gap-8 lg:gap-8 items-stretch">

          {/* Location card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-[0_2px_18px_rgba(0,0,0,0.1)] flex flex-col justify-between overflow-hidden min-h-[490px]">
            {/* Top-right Visual Asset Placement */}
            <div className="flex items-center justify-center px-14">
              {/* Replace this div with your actual image component */}
              <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center ">
                <img src={locationIcon?.src} className="w-full h-full object-contain " />
              </div>
            </div>

            {/* Card Content */}
            <div className="mt-10 pb-10">
              <h3 className="text-xl md:text-[35px] font-semibold text-gray-900 tracking-tight leading-none">
                Call to schedule your Service appointment
              </h3>

              <div className="mt-6 space-y-4">
                <p className="text-xl tracking-wide font-bold text-gray-900">Brampton</p>

                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <a
                    href={locationIcon?.src}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    8050 Dixie Rd
                  </a>
                </div>

                <div className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 shrink-0" />
                  <a href={PHONE_HREF} className="hover:text-emerald-500 transition-colors">
                    {PHONE_NUMBER}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] flex flex-col justify-between overflow-hidden min-h-[380px]">
            {/* Top-right Visual Asset Placement */}
            <div className="flex items-center justify-center px-14">
              {/* Replace this div with your actual image component */}
              <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center ">
                <img src={mapIcon?.src} className="w-full h-full object-contain " />
              </div>
            </div>

            {/* Card Content */}
            <div className="mt-10 pb-10 flex flex-col h-full justify-between items-start">
              <h3 className="text-xl md:text-[34px] font-bold text-gray-900">
                Find the time that Works best for you.
              </h3>

              <button className="block text-center text-white font-medium text-base w-full hover:opacity-90 transition-opacity rounded-[12px] py-3 px-[30px] bg-gradient-to-b from-[#00af66] to-[#00af66a6]">
                <a href={PHONE_HREF} className="w-full h-full">
                  Schedule Online
                </a>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/*  Main services grid */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Let's take care of your ride
            </h2>
            <p className="mt-3 text-muted-foreground text-base md:text-lg">Great ways to get started</p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainServices.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:border-brand-green/40 transition-all">
                <div className="h-14 w-14 rounded-xl bg-brand-green/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-brand-green" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Additional services */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Additional available services
          </h2>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {additionalServices.map(({ icon: Icon, label }) => (
              <a key={label} href={PHONE_HREF} className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-green/50 hover:shadow-md transition-all">
                <Icon className="h-8 w-8 text-brand-green" strokeWidth={2} />
                <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/*  Trust highlights */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight">
            Hit the road with confidence
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {trustHighlights.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-background/15 bg-background/5 p-7 hover:border-brand-green/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-brand-green/15 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-brand-green" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-background/75 leading-relaxed">{body}</p>
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

export default Service;
