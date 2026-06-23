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
  Phone, MapPin,
  Stethoscope, ThermometerSun, AlertCircle, Cog, Compass,
  Star, Clock, ShieldCheck,
  ArrowRight,
} from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Config
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

/* Page Component */
const Service = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      {/* Main Content Wrapper: Centers everything uniformly on large screens */}
      <main className="mx-auto w-full max-w-[1370px] px-6 md:px-12 flex-1">
        
        {/* Hero */}
        <section className="pt-16 md:pt-20 pb-10">
          <div className="text-start">
            <p className="text-base md:text-xl">
              Service & Repairs
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-foreground md:leading-[60px]">
              Quality Repairs,<br />
              Prices you can Trust.
            </h1>
          </div>
        </section>

        {/* Location & booking */}
        <section id="book" className="py-1 mx-auto max-w-[1200px] lg:px-10 ">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-8 items-stretch">

            {/* Location card */}
            <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-[0_2px_18px_rgba(0,0,0,0.1)] flex flex-col justify-between overflow-hidden min-h-[490px]">
              {/* Top-right Visual Asset Placement */}
              <div className="flex items-center justify-center lg:px-14">
                <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center ">
                  <Image src={locationIcon} alt="Location Icon" className="w-full h-full object-contain " />
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
              <div className="flex items-center justify-center lg:px-14">
                <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center ">
                  <Image src={mapIcon} alt="Map Icon" className="w-full h-full object-contain " />
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-14 pb-10 flex flex-col h-full gap-8 items-start">
                <h3 className="text-xl md:text-[30px] font-bold text-gray-900">
                  Find the time that Works best for you.
                </h3>

                <Link href={"/book-an-appointment"} className="block text-center cursor-pointer text-white font-medium text-base w-full hover:opacity-90 transition-opacity rounded-[12px] py-3 px-[30px] bg-gradient-to-b from-[#00af66] to-[#00af66a6]">
                  <button className="w-full h-full cursor-pointer">
                    Schedule Online
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Services grid */}
        <section className="pt-18">
          <div className="text-start">
            <h2 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900">
              Let's take care of your ride
            </h2>
            <p className="mt-2 text-base md:text-[21px] font-medium">
              Great ways to get started
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 pb-4">
            {Object.values(servicesData).map(({ id, cardText, section2Img }) => (
              <Link
                key={id}
                href={`/service/${id}`}
                className="relative w-full sm:w-[48%] md:w-[31%] lg:w-[19%] bg-white border-2 border-gray-200 p-[0.2] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

                <div className="relative z-20 pb-5">
                  <div className="h-56 lg:h-40 w-full overflow-hidden relative">
                    <Image
                      src={section2Img || "/placeholder.jpg"}
                      alt={id}
                      className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300"
                      fill
                    />
                  </div>

                  <div className="flex justify-between items-center px-3 mt-4">
                    <div className="py-2">
                      <h3 className="text-[17px] font-bold text-gray-600 capitalize">{id.replace('-', ' ')}</h3>
                      <p className="mt-1 text-sm text-black/70 font-normal leading-relaxed">
                        {cardText}
                      </p>
                    </div>

                    <div className="shrink-0">
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
        <section className="py-8 overflow-hidden ">
          <div className="flex flex-col lg:flex-row items-start gap-4">

            <div className="mb-6 lg:mb-0 max-w-xs shrink-0">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
                Additional available services
              </h2>
            </div>

            <div className="w-full lg:flex-1 lg:min-w-0">
              <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
                {additionalServices.map(({ icon: Icon, label }) => (
                  <Link
                    key={label}
                    href="/book-an-appointment"
                    className="shrink-0 inline-flex items-center gap-2 bg-white border border-[#00b066] hover:bg-[#00af66a6] hover:text-white text-[#00b066] rounded-xl px-4 py-3 transition-all duration-150"
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="text-sm whitespace-nowrap">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Trust highlights */}
        <section className="w-full bg-background">
          <div className="mx-auto py-10">
            <h2 className="text-[28px] lg:text-[44px] font-bold text-foreground tracking-tight mb-10">
              Hit the road with confidence
            </h2>

            {/* Three value-prop cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
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
      </main>

      {/* Footers sit naturally at the bottom, matching screen width layout */}
      <div className="w-full">
        <GetInTouch />
        <Footer />
      </div>
    </div>
  );
};

export default Service;