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
  Check,
} from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch, DreamVehicleCTA } from "@/components/common";

// Assets
import aboutHero from "@/assets/pages/about-hero.jpg";
import aboutTeam from "@/assets/pages/about-team.jpg";
import about from "@/assets/icons/about.png";
import blueCar from "@/assets/icons/cardora-blue-car.png";
import saleServices from "@/assets/icons/sale-services.jpg";
import reviews from "@/assets/icons/100reviews.png";
import forCanada from "@/assets/icons/proudlycanadian.png";

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

      <div>
        {/* Hero */}
      <section className="bg-white py-1 px-14">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

          {/* Left Column: Text Content */}
          <div className="w-full text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-none">
              Pre-Owned, Without Compromise.
            </h1>
            <p className="mt-6 text-base md:text-[23px] text-neutral-800 leading-relaxed font-normal">
              Only the best cars, backed by expertise and a customer- <br/>first experience.
              That&apos;s how Cardora does it.
            </p>
          </div>

          {/* Right Column: Image */}
          <div className="w-full flex justify-center md:justify-end">
            <img
              src={about?.src}
              alt="Cardora dealership illustration with flatbed delivery truck carrying a blue SUV"
              className="w-full max-w-[750px] h-auto object-contain"
              width={550}
              height={320}
            />
          </div>

        </div>
      </section>

      <hr className="mt-18 text-gray-200"/>
      {/*  Cardora Certified */}
     <section className="bg-white py-16 md:py-24 px-6 md:px-12 overflow-hidden">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 text-left">
            All our cars are Cardora Certified
          </h2>
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Column: Title & Badge List */}
        <div className="flex flex-col items-start ">
          <div className="mt-12 flex flex-col gap-4">
            {certified.map(({ icon: Icon, label }, index) => (
              <div 
                key={index} 
                className="flex items-center  gap-3 bg-[#e6f4ff] rounded-full px-5 py-4 w-full sm:w-80 shadow-[0_2px_18px_rgba(0,0,0,0.05)]"
              >
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm md:text-base font-medium text-neutral-800">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Car Image */}
        <div className="w-full md:max-w-[700px] p-32 mt-28 flex justify-center md:justify-end relative">
          <img
            src={blueCar?.src}
            alt="Blue Honda Civic Sedan showcasing Cardora Certified quality"
            className="w-full h-auto object-contain drop-shadow-xl -top-18 absolute -left-1"
            width={1000}
            height={500}
          />
        </div>

      </div>
    </section>

      {/* 1. After-Sale Service Section */}
      <section className="bg-[#eaeff5] py-16 md:py-18 px-6 md:px-12 my-14">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-9">
          
          {/* Left: Image Card Container */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm w-full">
              <img
                src={saleServices?.src}
                alt="Cardora service team standing proudly inside the dealership lot"
                className="w-full h-auto object-cover"
                width={540}
                height={320}
              />
            </div>
          </div>

          {/* Right: Text Block */}
          <div className="w-full text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
              After-Sale Service
            </h2>
            <p className="mt-5 text-base md:text-[19px] text-neutral-800 leading-relaxed font-normal">
              We&apos;re here for you long after you drive away. Our team is dedicated to 
              fast, efficient support and making sure every concern is handled with care.
            </p>
          </div>

        </div>
      </section>

      {/* 2. Reviews Section */}
      <section className="bg-white px-6 md:px-12">
        <div className="mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-12">
          
          {/* Left: Text Block */}
          <div className="w-full md:w-[1300px]">
            <h2 className="text-3xl md:text-[42px] lg:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
              Hundreds of Five-Star Reviews — and Counting
            </h2>
            <p className="mt-3 text-base md:text-[20px] text-neutral-800 leading-relaxed font-medium">
              Hundreds of five-star Google reviews and counting—because a great 
              experience is never accidental. 
            </p>
          </div>

          {/* Right: Graphic Cloud */}
          <div className="w-full flex justify-center md:justify-end">
            <img
              src={reviews?.src}
              alt="100+ Five-Star Reviews from Happy Customers illustration with Google logo"
              className="w-full h-auto object-contain"
              width={520}
              height={340}
            />
          </div>

        </div>
      </section>

      {/* 3. Built in Canada Section */}
      <section className="bg-white py-16 md:py-10 px-6 md:px-12">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          
          {/* Left: Graphic Illustration */}
          <div className="w-full flex justify-center md:justify-start">
            <img
              src={forCanada?.src}
              alt="Cardora dealership illustration featuring the Canadian flag and map silhouette"
              className="w-full h-auto object-contain"
              width={540}
              height={320}
            />
          </div>

          {/* Right: Text Block */}
          <div className="w-full text-left">
            <h2 className="text-3xl md:text-4xl lg:text-[43px] font-bold tracking-tight text-neutral-950">
              Built in Canada, for Canadians
            </h2>
            <p className="mt-3 text-lg md:text-xl text-neutral-900">
              A proudly homegrown success story
            </p>
            <p className="mt-4 text-base md:text-md text-neutral-900 leading-relaxed font-normal">
              Cardora was founded on a simple belief: Canadians deserve a better 
              pre-owned car experience. So we built one.
            </p>
          </div>

        </div>
      </section>
      </div>

      {/* <DreamVehicleCTA /> */}
      <GetInTouch />
      <Footer />
    </div>
  );
};

export default About;
