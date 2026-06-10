/* =========================
   About Us Page
   Tells the Cardora brand story.
   Sections:
   - Hero with background image overlay
   - "Cardora Certified" feature grid
   - After-sale service + reviews cards
   - "Built in Canada" story with team photo
   - DreamVehicleCTA → GetInTouch → Footer
========================= */

"use client";

import {
  ShieldCheck, Wrench, PhoneCall, RefreshCw,
  Star, Headphones, Leaf,
} from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch, DreamVehicleCTA } from "@/components/common";

// Assets
import aboutHero from "@/assets/pages/about-hero.jpg";
import aboutTeam from "@/assets/pages/about-team.jpg";

/*  Static Data */
const certified = [
  { icon: ShieldCheck, label: "6-month warranty" },
  { icon: Wrench,      label: "150-point inspection" },
  { icon: PhoneCall,   label: "Roadside assistance" },
  { icon: RefreshCw,   label: "10-day exchange" },
];

/*  Page Component */
const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/*  Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutHero.src}
            alt="Cardora dealership lot at golden hour"
            className="w-full h-full object-cover"
            width={1536}
            height={896}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/30" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32">
          <div className="max-w-2xl text-background">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Pre-Owned, Without Compromise.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-background/85 leading-relaxed">
              Only the best cars, backed by expertise and a customer-first experience. That's how Cardora does it.
            </p>
          </div>
        </div>
      </section>

      {/*  Cardora Certified */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            All our cars are <span className="text-brand-green">Cardora Certified</span>
          </h2>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {certified.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-brand-green/15 border border-brand-green/30 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-brand-green" strokeWidth={2.2} />
                </div>
                <p className="mt-4 text-base md:text-lg font-semibold text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  After-sale service + Reviews */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-2 gap-10 md:gap-16">
          {/* After-sale service card */}
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="h-14 w-14 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Headphones className="h-7 w-7 text-brand-green" strokeWidth={2.2} />
            </div>
            <h3 className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              After-Sale Service
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We're here for you long after you drive away. Our team is dedicated to fast, efficient support and making sure every concern is handled with care.
            </p>
          </div>

          {/* Reviews card */}
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="h-14 w-14 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Star className="h-7 w-7 text-brand-green fill-brand-green" strokeWidth={2.2} />
            </div>
            <h3 className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Hundreds of Five-Star Reviews — and Counting
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Hundreds of five-star Google reviews and counting—because a great experience is never accidental.
            </p>
            <div className="mt-5 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-brand-green fill-brand-green" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  Built in Canada */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
              <Leaf className="h-4 w-4 text-brand-green" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                Proudly Canadian
              </span>
            </div>
            <h2 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Built in Canada, for Canadians
            </h2>
            <p className="mt-4 text-lg text-brand-green font-semibold">
              A proudly homegrown success story
            </p>
            <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">
              Cardora was founded on a simple belief: Canadians deserve a better pre-owned car experience. So we built one.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={aboutTeam.src}
              alt="The Cardora team"
              loading="lazy"
              width={1536}
              height={896}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      <DreamVehicleCTA />
      <GetInTouch />
      <Footer />
    </div>
  );
};

export default About;
