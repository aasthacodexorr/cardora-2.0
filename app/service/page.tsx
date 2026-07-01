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
  ThermometerSun,
  Star, Clock, ShieldCheck,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Config
import { PHONE_HREF, PHONE_NUMBER } from "@/constants";
import { servicesData } from "@/constants/serviceData";
import locationIcon from "@/assets/icons/location.png";
import mapIcon from "@/assets/icons/map-c.png";
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
  { 
    renderIcon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" {...props} className="w-6 h-6">
        <path d="M792-120.67 532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l260 258.66-48 48Zm-414-272q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Zm-34-76.66v-81.34h-81.33v-66.66H344V-698h66.67v80.67h80.66v66.66h-80.66v81.34H344Z"></path>
      </svg>
    ), 
    label: "General Diagnosis" 
  },
  { renderIcon: (props: any) => <ThermometerSun {...props} />, label: "AC / Heating" },
  { renderIcon: (props: any) => <AlertTriangle {...props} />, label: "Check Engine Light" },
  { 
    renderIcon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M24.0002 6.66667H20V9.33301H17.3333V6.66667H13.3335V4H24.0002V6.66667ZM29.3335 22.333L29.3335 14.333H32.0002V22.333H29.3335ZM0 23.6667L3.49697e-07 17H2.66667L2.66667 23.6667H0ZM10.995 18.1333H7.8433V23.2H9.18491L13.7563 26.6667H20.6668L24.157 22.8546V14.6667H14.0426L10.995 18.1333ZM12.9525 12H26.6668V24.1333L21.9049 29.3333H12.9525L8.38112 25.8667H5.3335V15.4667H9.90493L12.9525 12ZM18.0002 16V19.3333H20.6668L17.3335 25.3333V22H14.6668L18.0002 16Z"></path>
      </svg>
    ), 
    label: "Powertrain & Engine" 
  },
  { 
    renderIcon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M16 2.66699C17.3098 2.66699 18.5754 2.85585 19.7713 3.20782C18.8497 3.78278 18.0537 4.54006 17.4337 5.42918C16.9647 5.36619 16.4862 5.33366 16 5.33366C10.5605 5.33366 6.07203 9.4052 5.41587 14.6669H9.33349H10.6668H17.5017C18.5644 16.144 20.1182 17.2441 21.9241 17.728C21.0115 19.4905 19.3353 20.7939 17.3335 21.2002L17.3335 26.5844C22.0742 25.9932 25.8488 22.291 26.5497 17.5851C27.5894 17.2358 28.5337 16.6787 29.3333 15.9631L29.3333 16.0003C29.3333 23.3641 23.3638 29.3337 16 29.3337C8.6362 29.3337 2.66666 23.3641 2.66666 16.0003C2.66666 8.63653 8.6362 2.66699 16 2.66699ZM9.88822 17.3336L5.41585 17.3336C6.01748 22.1586 9.84177 25.9829 14.6668 26.5845L14.6668 21.2002C12.5184 20.7641 10.7451 19.2948 9.88822 17.3336ZM16 26.667L15.9577 26.6669H16.0423L16 26.667ZM29.3333 10.0002C29.3333 12.9457 26.9455 15.3335 24 15.3335C21.0545 15.3335 18.6667 12.9457 18.6667 10.0002C18.6667 7.05468 21.0545 4.66687 24 4.66687C26.9455 4.66687 29.3333 7.05468 29.3333 10.0002ZM23.3334 11.3332H24.6667V5.99988H23.3334V11.3332ZM23.3334 13.9999H24.6667V12.6665H23.3334V13.9999Z"></path>
      </svg>
    ), 
    label: "Steering & Suspension" 
  },
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

/* Animation Configs */
const fadeInDown:Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants:Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const cardHover: Variants = {
  hover: { y: -6, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.08)", transition: { duration: 0.2, ease: "easeInOut" } }
};

const Service = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      {/* Main Content Wrapper */}
      <main className="mx-auto w-full max-w-[1350px] px-5 md:px-12 flex-1 lg:mt-18 overflow-hidden">
        
        {/* Hero */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeInDown}
          className="pt-16 md:pt-20 pb-10"
        >
          <div className="text-start">
            <p className="text-base md:text-xl text-emerald-600 font-medium tracking-wide">
              Service & Repairs
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-foreground md:leading-[60px]">
              Quality Repairs,<br />
              Prices you can Trust.
            </h1>
          </div>
        </motion.section>

        {/* Location & booking */}
        <section id="book" className="py-1 mx-auto max-w-[1200px] lg:px-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8 lg:gap-8 items-stretch"
          >
            {/* Location card */}
            <motion.div 
              variants={fadeInUp}
              className="relative bg-white rounded-2xl p-8 md:p-10 shadow-[0_2px_18px_rgba(0,0,0,0.1)] flex flex-col justify-between overflow-hidden min-h-[490px]"
            >
              <div className="flex items-center justify-center lg:px-14">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center"
                >
                  <Image src={locationIcon} alt="Location Icon" className="w-full h-full object-contain" />
                </motion.div>
              </div>

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
            </motion.div>

            {/* Booking card */}
            <motion.div 
              variants={fadeInUp}
              className="relative bg-white rounded-3xl p-8 md:p-10 shadow-[0_2px_18px_rgba(0,0,0,0.1)] flex flex-col justify-between overflow-hidden min-h-[380px]"
            >
              <div className="flex items-center justify-center lg:px-14">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                  className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center"
                >
                  <Image src={mapIcon} alt="Map Icon" className="w-full h-full object-contain" />
                </motion.div>
              </div>

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
            </motion.div>
          </motion.div>
        </section>

        {/* Services grid */}
        <section className="pt-18">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-start"
          >
            <h2 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900">
              Let's take care of your ride
            </h2>
            <p className="mt-2 text-base md:text-[21px] font-medium text-slate-500">
              Great ways to get started
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="mt-10 flex flex-wrap gap-3 pb-4"
          >
            {Object.values(servicesData).map(({ id, cardText, section2Img }) => (
              <motion.div
                key={id}
                variants={fadeInUp}
                whileHover="hover"
                className="w-full sm:w-[48%] md:w-[31%] lg:w-[19%] bg-white border-2 border-gray-100 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm group cursor-pointer"
              >
                <Link href={id === "battery" ? "/book-an-appointment" : `/service/${id}`} className="h-full flex flex-col justify-between relative">
                  <div className="absolute inset-0 bg-[#2f41390a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  
                  <div className="relative z-20 pb-5 h-full flex flex-col justify-between">
                    <div>
                      <div className="h-64 lg:h-40 w-full overflow-hidden relative">
                        <Image
                          src={section2Img || "/placeholder.jpg"}
                          alt={id}
                          className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                          fill
                        />
                      </div>

                      <div className="px-3 mt-4">
                        <h3 className="text-[17px] font-bold text-gray-800 capitalize">{id.replace('-', ' ')}</h3>
                        <p className="mt-1 text-sm text-black/70 font-normal leading-relaxed">
                          {cardText}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end items-center px-3 mt-4">
                      <div className="shrink-0 group-hover:translate-x-1 transition-transform duration-200">
                        <ArrowRight className="h-5 w-5 text-emerald-600" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Additional services section */}
        <section className="py-8 overflow-hidden">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-start gap-4"
          >
            <motion.div variants={fadeInUp} className="mb-6 lg:mb-0 max-w-xs shrink-0">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
                Additional available services
              </h2>
            </motion.div>

            <motion.div variants={fadeInUp} className="w-full lg:flex-1 lg:min-w-0">
              <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
                {additionalServices.map(({ renderIcon: RenderIcon, label }) => (
                  <Link
                    key={label}
                    href="/book-an-appointment"
                    className="shrink-0 inline-flex items-center gap-2 bg-white border border-[#00b066] hover:bg-gradient-to-b from-[#00af66] to-[#00af66a6] hover:text-white text-[#00b066] rounded-xl px-4 py-3 transition-all duration-150 hover:shadow-sm"
                  >
                    <RenderIcon className="h-4 w-4 shrink-0" />
                    <span className="text-sm whitespace-nowrap mt-[3px]">{label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Trust highlights */}
        <section className="w-full bg-background mt-10">
          <div className="mx-auto py-5 pb-16">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-[28px] lg:text-[44px] font-bold text-foreground tracking-tight mb-10"
            >
              Hit the road with confidence
            </motion.h2>

            {/* Three value-prop cards */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]"
            >
              {trustHighlights?.map((item, idx) => (
                <motion.div key={idx} variants={fadeInUp} whileHover="hover">
                  <DifferenceCard
                    icon={icons[idx]}
                    text={item.title}
                    body={item.body}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <div className="w-full">
        <GetInTouch />
        <Footer />
      </div>
    </div>
  );
};

export default Service;