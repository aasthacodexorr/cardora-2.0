import Link from 'next/link';
import { notFound } from 'next/navigation';
import { servicesData } from '@/constants/serviceData';
import FaqAccordion from '@/components/common/FaqAccordion';
import { Footer, Header } from '@/components/layout';
import { Reviews } from '@/components/home';
import { GetInTouch } from '@/components/common';
import { getAppConfig } from "@/lib/appConfig";
import { getConstants } from '@/constants';
import Image from "next/image";
import DownloadCouponButton from '@/components/service/DownloadCouponButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePage({ params }: PageProps) {
  const appConfig = await getAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  const { id } = await params;
  const serviceKey = id;
  const currentData = servicesData[serviceKey];

  if (!currentData) {
    notFound();
  }

  // Filter out current active card from the deck below
  const otherCards = Object.values(servicesData).filter(item => item.id !== serviceKey);

  return (
    <div className="min-h-screen font-sans bg-white antialiased">
      <Header />

      {/* SECTION 1: Hero with Title + Coupon Side by Side */}
      <section className="w-full bg-gradient-to-b from-white to-[#f4f9fc] py-12 md:py-20 flex items-center lg:mt-28">
        <div className="md:px-36 px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

            {/* Left: Title and Checklist */}
            <div className="lg:col-span-6 space-y-8 pt-4">
              <h1 className="text-4xl md:text-[63px] font-bold text-black tracking-tight leading-[1.1]">
                {currentData.cityTitle || `Oil Change in ${appConfig.dealership.city_1}, ${appConfig.dealership.province_1}`}
              </h1>

              <ul className="w-full divide-y divide-slate-200/60 border-b border-slate-200/60">
                {(currentData.bannerChecklist || [
                  "Premium Synthetic Oil",
                  "Fast & Reliable Service",
                  "Multi-Point Vehicle Inspection",
                  "High-Quality Oil Filters"
                ]).map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-3.5 text-[18px] font-medium tracking-wide">
                    <span>{item}</span>
                    <svg className="w-6 h-6 text-[#10b981] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Coupon Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              {/* Added "relative" and "pt-8" to accommodate the absolute badge sticking over the top border */}
              <div className="relative w-full max-w-[500px] bg-white border border-dashed border-[#10b981] p-6 pt-10 shadow-[0_0_30px_rgba(244,249,252,1.3)] rounded-xl">

                {/* Top Label (Ribbon / Badge style matching image_f8518a.png) */}
                <div className="absolute -top-6 left-4 flex items-center gap-1.5 bg-[#00af66] rounded-l-lg text-white font-bold text-[12px] md:text-[14px] tracking-wider uppercase pl-1 pr-5 py-1 shadow-md clip-ribbon">
                  <span className='border-l border-t border-b border-dashed border-white/50 rounded-l-lg flex justify-center items-center p-1'><svg className="w-7 h-7  flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
                  </svg>
                    Limited Time Offer!</span>
                </div>

                {/* Coupon Header */}
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-5">
                  {currentData.couponTitle || "Oil Change Coupon"}
                </h3>

                {/* Main Image Container & Floating Expiry Badge */}
                <div className="relative w-full mb-6">
                  <div className="w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                    <Image
                      src={currentData.couponImg || "image_92f420.png"}
                      alt="Save $20 Oil Change Coupon"
                      className="w-full h-auto object-cover"
                      width={500}
                      height={300}
                    />
                  </div>

                  {/* Overlapping Floating Expiry Badge matching image_f8518a.png */}
                  <div className="absolute -bottom-6 left-0 bg-white border border-[#10b981] rounded-xl px-2 py-2 flex items-center gap-2.5 shadow-sm">
                    <div className="text-[#00b066]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-slate-800 font-bold tracking-wider uppercase leading-none">OFFER EXPIRES</span>
                      <span className="text-[20px] font-bold text-[#00b066] leading-tight">6/30/2026</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (Arranged horizontally matching image_f8518a.png) */}
                <div className="flex justify-start items-start gap-3 mt-14">
                  <Link href="/book-an-appointment" className="flex items-center w-fit justify-center bg-gradient-to-b from-[#00af66] to-[#00af66a6] hover:brightness-95 text-white font-medium py-3 px-6 rounded-xl transition duration-200 text-center text-xs md:text-sm shadow-sm border border-[#00af66]">
                    Schedule Service
                  </Link>
                  <DownloadCouponButton
                    imageUrl={currentData.couponImg}
                    fileName={currentData.couponTitle || "Coupon"}
                  // Inside your component, ensure DownloadCouponButton matches this same padding, shape, and background look!
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Alert Message Intro Container */}
      <section className="w-full bg-[#e6f4ff] py-8 md:py-5 ">
        <div className="px-5 xl:px-56 py-0 xl:py-8 text-center text-base md:text-[20px] text-slate-900 tracking-wide flex flex-col gap-1">
          <p>{currentData.introText1}</p>
          <p>{currentData.introText2}</p>
          <p>{currentData.introText3}</p>
        </div>
      </section>

      {/* SECTION 3: Why Regular Changes Matter */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto px-4 md:px-32">
          <div className="flex flex-col md:flex-row md:gap-28 gap-8 items-start">

            {/* Left Column Content */}
            <div className=" w-full xl:max-w-[50%] space-y-5">
              <h2 className="text-3xl md:text-[44px] font-bold text-black tracking-tight leading-[1.15]">
                {currentData.section2Title || "Why Regular Oil Changes Matter"}
              </h2>

              <h2 className="text-[20px] lg:text-2xl text-black leading-[1.5]">{currentData.section2Sub}</h2>

              <p className="text-[20px] lg::text-[24px] font-medium tracking-wide">
                {currentData.section2Body}
              </p>

              {/* Bordered Clean List Block */}
              <ul className="w-full border-t border-slate-100 divide-y divide-slate-100 text-[18px] font-medium tracking-wide">
                {(currentData.section2Checklist || [
                  "Lubricating moving engine parts",
                  "Reduces friction",
                  "Preventing sludge buildup",
                  "Helping improve fuel economy",
                  "Extending engine life"
                ]).map((item, i) => (
                  <li key={i} className="py-3 text-left">
                    {item}
                  </li>
                ))}
              </ul>

              {/* Bottom Body Copy */}
              <div className="space-y-3 text-[17px] leading-[1.6] font-medium tracking-wide">
                <p>{currentData?.section2LastBody1}</p>
                <p>{currentData?.section2LastBody2}</p>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="w-full">
              <div className={`w-full sm:aspect-[16/14] lg:aspect-[11/12] rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 bg-slate-50 relative ${id == "brakes" ? "lg:h-[400px]" : "h-full"}`}>
                <Image
                  src={currentData.section2Img}
                  alt="Pouring fresh engine oil from container"
                  className={`w-full h-full object-cover`}
                  width={400}
                  height={800}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Dual Box Highlights Grid */}
      <section className="w-full bg-[#e6f4ff] py-12">
        <div className="mx-auto px-4 md:px-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

            {/* Box 1: Signs You Need Service */}
            <div className="bg-white h-full lg:max-h-96 rounded-[20px] p-7 md:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col justify-between items-start gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10 text-[#10b981] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-black tracking-tight">
                    {currentData?.signtitle1 || "Signs You Need an Oil Change"}
                  </h3>
                </div>

                <ul className="pl-14">
                  {(currentData.signsList1 || [
                    "Oil change or check engine light is on",
                    "Engine sounds louder than usual",
                    "Burning oil smell",
                    "Poor fuel economy",
                    "Dirty or dark engine oil",
                    "Vehicle feels rough while driving"
                  ]).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[18px] font-medium tracking-wide">
                      <span className="text-black font-bold text-base select-none leading-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className=" text-[15px] md:text-[18px] leading-[1.5] font-medium tracking-wide border-t border-slate-50  pl-14">
                {currentData?.signLastBody1 || "Not sure if it's time? Our team can inspect your vehicle and recommend the right maintenance schedule."}
              </p>
            </div>

            {/* Box 2: What's Included */}
            <div className="bg-white h-full lg:max-h-96 rounded-[20px] p-8 md:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10 text-[#10b981] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                    {currentData.signtitle2 || "Our Oil Change Service Includes"}
                  </h3>
                </div>
                <p className='text-lg pl-14'>{currentData.signsListBody1}</p>
                <p className="pl-14 text-lg">{currentData.signsListBody2}</p>

                <ul className="pl-14">
                  {(currentData.signList2 || [
                    "Free inspection for your air and cabin filters",
                    "Drain and replace engine oil and install a new oil filter",
                    "Fluid level inspection",
                    "Tire pressure check",
                    "Visual inspection of major components",
                    "Reset maintenance reminders (if applicable)"
                  ]).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-900 text-[18px] font-medium tracking-wide">
                      <span className="text-black font-bold text-base select-none leading-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[15px] md:text-[18px] font-medium pt-3 border-t border-slate-50  pl-14 ">
                {currentData?.signLastBody2}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: Premium Service Highlight */}
      {
        currentData?.premiumTitle ? <section className="w-full bg-white py-12 md:py-16 px-4 md:px-32">
          <div className={`flex flex-col md:flex-row gap-10 lg:gap-16 ${id === "wheel-service" ? "items-center" : "items-start"}`}>

            {/* Left Column Image */}
            <div className={`w-full   ${["wheel-service", "tire-service"].includes(id) ? "lg:min-w-[50%]" : "lg:max-w-[45%] lg:min-h-[700px]"}  `}>
              <div className=" w-full aspect-[11/12] sm:aspect-[16/14] lg:aspect-[11/16] rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] relative">
                <Image
                  src={currentData.premiumImg || "image_85aa7b.jpg"}
                  alt="Premium synthetic oil change service execution"
                  className={`w-full h-full object-cover lg:p-3 rounded-3xl ${["wheel-service", "tire-service"].includes(id) ? "lg:max-h-[50%]" : "lg:max-w-[95%]"}`}
                  fill
                />
              </div>
            </div>

            {/* Right Column Content */}
            <div className={`lg:col-span-6 space-y-2 ${id === "wheel-service" ? "lg:-mt-[400px]" : ""}`}>
              <h2 className="text-3xl md:text-[45px] font-bold text-black tracking-tight leading-[1.15]">
                {currentData.premiumTitle || "Premium Synthetic Oil Change Service"}
              </h2>

              <p className=" text-[20px] font-medium tracking-wide">
                {currentData?.premiumBody1 || `At ${SITE_CONFIG?.dealership.name}, we use high-quality synthetic oil designed to provide superior engine protection and performance in all driving conditions.`}
              </p>

              {
                currentData.premiumBody ? <>
                  <div className="text-[20px] tracking-wide ">
                    Synthetic oil helps:
                  </div>

                  <ul className="w-full border-t border-slate-100 divide-y divide-slate-100 text-[18px] font-medium tracking-wide">
                    {[
                      "Protect your engine during extreme Ontario temperatures",
                      "Improve engine performance and efficiency",
                      "Reduce engine wear and buildup",
                      "Last longer than conventional oil",
                      "Support smoother cold-weather starts"
                    ].map((item, i) => (
                      <li key={i} className="py-3 text-left">
                        {item}
                      </li>
                    ))}
                  </ul>
                </> : null
              }

              <div className="text-[18px] leading-[1.6] font-medium tracking-wide">
                <p>
                  {currentData.premiumBody2}
                </p>
                <p>
                  {currentData.premiumBody3}
                </p>
              </div>
            </div>

          </div>
        </section> : null
      }

      {/* SECTION 6: Why Drivers Choose Us */}
      <section className={`w-full bg-[#eeeeee] py-6 md:py-18  ${id === "tire-service" ? "lg:-mt-[380px]" : id === "wheel-service" ? "lg:-mt-[380px]" : null}`}>
        <div className="px-4 md:px-28">
          {/* Dynamic flex ordering based on the 'id' variable */}
          <div
            className={`flex gap-10 lg:gap-12 items-start ${id === "brakes"
              ? "flex-col-reverse md:flex-row-reverse"
              : "flex-col md:flex-row"
              }`}
          >

            {/* Text Grid Features */}
            <div className="w-full lg:max-w-[60%]">
              <h2 className="text-3xl md:text-[40px] font-bold text-black tracking-tight leading-[1.15]">
                {currentData?.whyTitle || `Why Drivers in ${appConfig.dealership.city_1} Choose ${appConfig.dealership.dealership_name}`}
              </h2>

              <ul className="w-full  mt-4 border-slate-200/60 divide-y divide-slate-200/60 text-[18px] font-medium tracking-wide">
                {(currentData?.whyFeature || [
                  "Honest recommendations with no pressure",
                  "Experienced technicians",
                  "Quick turnaround times",
                  "Transparent pricing",
                  `Convenient ${appConfig.dealership.city_1} location`,
                  "Trusted customer service experience"
                ]).map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-between py-3">
                    <svg className="w-4 h-4 text-[#10b981] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-900 text-right font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-slate-900 text-[18px] leading-[1.6] font-medium tracking-wide pt-2">
                {currentData?.whyLastBody || "We know your time matters. Our goal is to get you back on the road quickly and confidently."}
              </p>
            </div>

            {/* Facility Showcase Image */}
            <div className="w-full">
              <div className="w-full aspect-[4/3] sm:aspect-[16/12] rounded-md overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative">
                <Image
                  src={currentData?.whyImg || "https://www.cardora.ca/wp-content/uploads/2026/05/cardora-service-1280x904.webp"}
                  alt={`${appConfig.dealership.dealership_name} ${appConfig.dealership.city_1} Facility Storefront with parked vehicles`}
                  className="w-full h-full object-cover max-h-[88%] rounded-2xl"
                  fill
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: Related Services Grid */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="  px-4 md:px-28">

          <div className="text-left mb-10 space-y-1.5">
            <h2 className="text-3xl md:text-[40px] font-bold text-black tracking-tight">
              Let&apos;s take care of your ride
            </h2>
            <p className="text-slate-900 text-[20px] font-medium tracking-wide">
              Great ways to get started
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCards.slice(0, 4).map((card) => (
              <Link
                key={card.id}
                href={card.id === "battery" ? "/book-an-appointment" : `/service/${card.id}`}
                className="group bg-white pb-6 relative border-2 border-slate-200/70 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

                <div className="aspect-[16/11] bg-slate-50 overflow-hidden w-full relative ">
                  <Image
                    src={card.section2Img || "image_85493b.jpg"}
                    alt={card.id}
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-start space-y-1">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <h4 className="text-[17px] font-bold text-slate-900 capitalize tracking-tight">
                      {card.id.replace('-', ' ')}
                    </h4>
                    <svg className="w-4 h-4 text-[#10b981] flex-shrink-0 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  <p className=" text-[15px] leading-snug font-medium tracking-wide line-clamp-2">
                    {card.cardText || "Issues, pads, rotors, calipers"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: Google Reviews Grid Block */}
      <section className="w-full bg-[#eaeff5] border-t border-slate-100">
        <Reviews />
      </section>

      {/* SECTION 9: FAQ Section */}
      <section className="w-full bg-white py-20 border-t border-slate-100">
        <div className="  px-4 md:px-18">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <FaqAccordion faqs={currentData.faqs || [
            { question: "How often should I get an oil change?", answer: "Typically every 5,000 to 7,500 miles for synthetic blends, or as advised by vehicle manufacturers specifications." }
          ]} />
        </div>
      </section>

      {/* SECTION 10: Final Inline CTA Row */}
      <section className="w-full bg-[#eaeff5] border-t border-slate-100 py-8 text-center">
        <div className="  px-4 md:px-82 md:py-10 space-y-3 py-5">
          <p className="text-xl md:text-3xl ">
            Book your oil change service today at {appConfig.dealership.dealership_name} {appConfig.dealership.city_1} and keep your vehicle performing at its best.
          </p>
          <div>
            <Link href="/book-an-appointment" className="inline-block border border-[#00b066] py-3 px-10 mt-4 rounded-lg transition duration-200 text-xs md:text-lg text-[#00b066] bg-white hover:text-white hover:bg-gradient-to-b from-[#00af66] to-[#00af66a6]">
              Schedule Service
            </Link>
          </div>
        </div>
      </section>

      <GetInTouch />

      <Footer />
    </div>
  );
}