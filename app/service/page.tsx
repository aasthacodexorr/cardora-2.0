/* =========================
   Service Page
   Cardora's vehicle service & repair page.
   Sections:
   - Hero with schedule CTA
   - Location & booking cards
   - "Take care of your ride" service grid (dynamic from serviceData)
   - Additional services grid
   - "Hit the road with confidence" trust highlights
   - DreamVehicleCTA → GetInTouch → Footer
========================= */

"use client";

import Link from "next/link";
import {
  Phone, MapPin, CalendarCheck,
  Droplets, Disc3, Gauge, BatteryCharging, Wrench,
  Stethoscope, ThermometerSun, AlertCircle, Cog, Compass,
  Star, Clock, ShieldCheck,
  ArrowRight,
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
import { servicesData } from "@/constants/serviceData";
import locationIcon from "@/assets/icons/location.png";
import mapIcon from "@/assets/icons/map-c.png";
import Image from "next/image";
import { appConfig } from "@/lib/appConfig";

import CheckIcon from "@/assets/icons/CHECK_ICON.svg";
import MapIcon   from "@/assets/icons/MAP-ICON.svg";
import HeartIcon from "@/assets/icons/HEART-ICON.svg";
import DifferenceCard from "@/components/home/cardora-difference/DifferenceCard";


const icons = [
  <Image src={CheckIcon} alt="Check Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
  <Image src={MapIcon} alt="Map Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
  <Image src={HeartIcon} alt="Heart Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
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

      <div className="px-12">
        {/*  Hero */}
        <section className="pt-16 md:pt-20 pb-10 ">
          <div className="mx-auto text-start">
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
          <div className="mx-auto max-w-[1200px] px-10 grid md:grid-cols-2 gap-8 lg:gap-8 items-stretch">

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

                <div className="mt-8 space-y-4">
                  <p className="text-2xl tracking-wide text-gray-900">{appConfig.dealership.city_1}</p>

                  <div className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <a
                      href={appConfig.dealership.address_map_url_1 || appConfig.dealership.address_1_bar}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-emerald-500 transition-colors"
                    >
                      {appConfig.dealership.full_address_1}
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
            <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-[0_2px_18px_rgba(0,0,0,0.1)] flex flex-col justify-between overflow-hidden min-h-[380px]">
              {/* Top-right Visual Asset Placement */}
              <div className="flex items-center justify-center px-14">
                {/* Replace this div with your actual image component */}
                <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center ">
                  <img src={mapIcon?.src} className="w-full h-full object-contain " />
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-14 pb-10 flex flex-col h-full gap-8 items-start">
                <h3 className="text-xl md:text-[30px] font-bold text-gray-900">
                  Find the time that Works best for you.
                </h3>

                <Link href={"/book-an-appointment"} className="block text-center cursor-pointer text-white font-medium text-base w-full hover:opacity-90 transition-opacity rounded-[12px] py-3 px-[30px] bg-gradient-to-b from-[#00af66] to-[#00af66a6]">
                  <button  className="w-full h-full cursor-pointer">
                    Schedule Online
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        <section className="pt-18">
        <div className="text-start">
          <h2 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900">
            Let's take care of your ride
          </h2>
          <p className="mt-2 text-base md:text-[21px] font-medium">
            Great ways to get started
          </p>
        </div>

        {/* Horizontal scroll on small screens, 5 columns on large screens */}
          <div className="mt-10 flex flex-wrap gap-3 pb-4">
            {Object.values(servicesData).map(({ id, cardText, section2Img }) => (
              <Link
                key={id}
                href={`/service/${id}`}
                className="relative w-full sm:w-[48%] md:w-[31%] lg:w-[19%] bg-white border-2 border-gray-200 p-[0.2] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                {/* Full Card Overlay */}
                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

                {/* Card Content */}
                <div className="relative z-20 pb-5">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={section2Img}
                      alt={id}
                      className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300"
                    />
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="py-4 px-2">
                      <h3 className="text-[17px] font-bold text-gray-600 capitalize">{id.replace('-', ' ')}</h3>
                      <p className="mt-1 text-base text-black/70 font-normal leading-relaxed">
                        {cardText}
                      </p>
                    </div>

                    <div className="pb-4 pr-2">
                      <ArrowRight
                        className="h-5 w-5 text-emerald-600 opacity-80 transition-all"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
      </section>

      {/* Additional services section */}
      <section className="py-8">
        <div className="flex flex-col lg:flex-row items-start">
          
          {/* Section Title */}
          <div className="mb-6 lg:mb-0 max-w-xs shrink-0">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
              Additional available services
            </h2>
          </div>

          {/* Action pills wrapper */}
          <div className="flex flex-wrap gap-2 items-center">
            {additionalServices.map(({ icon: Icon, label }) => (
              <Link 
                key={label} 
                href={"/book-an-appointment"}
                className="inline-flex items-center gap-2 bg-white border border-[#00b066] hover:bg-[#00af66a6] hover:opacity-90 transition-opacity hover:text-white text-[#00b066] rounded-xl px-4 py-3 transition-all duration-150"
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

        {/*  Trust highlights */}
        <section className="w-full bg-background">
          <div className="mx-auto py-14">
            <h2 className="text-[34px] lg:text-[44px] font-bold text-foreground tracking-tight mb-10">
              Hit the road with confidence
            </h2>

            {/* Three value-prop cards */}
            <div className="flex justify-start gap-[40px] flex-col md:flex-row">
              {trustHighlights?.map((item, idx) => (
                <DifferenceCard
                  key={idx}
                  icon={icons[idx]}
                  text={item.title}
                  body={item.body}
                />
              ))}
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

export default Service;
