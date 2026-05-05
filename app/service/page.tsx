"use client";

import {
  Phone,
  MapPin,
  CalendarCheck,
  Droplets,
  Disc3,
  Gauge,
  BatteryCharging,
  Wrench,
  Stethoscope,
  ThermometerSun,
  AlertCircle,
  Cog,
  Compass,
  Star,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import DreamVehicleCTA from "@/components/DreamVehicleCTA";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/config";

const mainServices = [
  { icon: Droplets, title: "Oil Change & Lube", body: "Engine oil change, filter, reset oil light" },
  { icon: Disc3, title: "Tire & Wheel Service", body: "Replacement, flat, rotation, alignment" },
  { icon: Gauge, title: "Brakes", body: "Issues, pads, rotors, calipers" },
  { icon: BatteryCharging, title: "Battery", body: "Charge, replacement, testing, starter" },
  { icon: Wrench, title: "Scheduled Maintenance", body: "Manufacturer service intervals" },
];

const additionalServices = [
  { icon: Stethoscope, label: "General Diagnosis" },
  { icon: ThermometerSun, label: "AC / Heating" },
  { icon: AlertCircle, label: "Check Engine Light" },
  { icon: Cog, label: "Powertrain & Engine" },
  { icon: Compass, label: "Steering & Suspension" },
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

const Service = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-green/10 via-brand-green/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-brand-green">
            Service & Repairs
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Quality Repairs,
            <br />
            <span className="text-brand-green">Prices you can Trust.</span>
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-8 h-12 font-semibold"
            >
              <a href="#book">Schedule Online</a>
            </Button>
            <a
              href="tel:1-855-514-5500"
              className="inline-flex items-center gap-2 text-foreground font-bold hover:text-brand-green transition-colors"
            >
              <Phone className="h-5 w-5 fill-brand-green text-brand-green" />
              1-855-514-5500
            </a>
          </div>
        </div>
      </section>

      {/* Location & booking */}
      <section id="book" className="py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-foreground">
              Call to schedule your Service appointment
            </h3>
            <div className="mt-6">
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                Brampton
              </p>
              <a
                href={SITE_CONFIG.urls.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="block mt-1 text-lg font-semibold text-foreground hover:text-brand-green"
              >
                8050 Dixie Rd
              </a>
              <a
                href="tel:1-855-514-5500"
                className="mt-2 inline-flex items-center gap-2 text-brand-green font-bold text-lg"
              >
                <Phone className="h-4 w-4 fill-brand-green" />
                1-855-514-5500
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-foreground">
              Find the time that works best for you.
            </h3>
            <p className="mt-2 text-muted-foreground">
              Book your service slot online and we'll confirm right away.
            </p>
            <Button
              asChild
              className="mt-6 bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-8 h-12 font-semibold"
            >
              <a href="tel:1-855-514-5500">Schedule Online</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Take care of your ride */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Let's take care of your ride
            </h2>
            <p className="mt-3 text-muted-foreground text-base md:text-lg">
              Great ways to get started
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainServices.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:border-brand-green/40 transition-all"
              >
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

      {/* Additional services */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Additional available services
          </h2>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {additionalServices.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="tel:1-855-514-5500"
                className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-green/50 hover:shadow-md transition-all"
              >
                <Icon className="h-8 w-8 text-brand-green" strokeWidth={2} />
                <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Hit the road with confidence */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight">
            Hit the road with confidence
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {trustHighlights.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-background/15 bg-background/5 p-7 hover:border-brand-green/50 transition-colors"
              >
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
