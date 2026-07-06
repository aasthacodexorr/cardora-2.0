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

import { ShieldCheck, Wrench, PhoneCall, RefreshCw, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
// Layout
import { Header, Footer } from "@/components/layout";
// Shared components
import { GetInTouch } from "@/components/common";
import Image from "next/image";
import about from "@/assets/icons/about.png";
import blueCar from "@/assets/icons/cardora-blue-car.png";
import saleServices from "@/assets/icons/sale-services.jpg";
import reviews from "@/assets/icons/100reviews.png";
import forCanada from "@/assets/icons/proudlycanadian.png";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

/* Static Data */
const certified = [
  { icon: ShieldCheck, label: "6-month warranty" },
  { icon: Wrench, label: "150-point inspection" },
  { icon: PhoneCall, label: "Roadside assistance" },
  { icon: RefreshCw, label: "10-day exchange" },
];

/* Animation Constants */
const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: "easeOut" } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const About = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <div className="flex-1 w-full overflow-hidden px-0 lg:mt-20">
        
        {/* Hero Section: Text static, Image slides in repeatedly */}
        <section className="bg-white pb-12 mt-4 px-5">
          <div className="mx-auto lg:max-w-[1240px] md:px-1 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Left Column: Static Text Content */}
            <div className="w-full text-left md:w-2xl md:pt-5 lg:w-full">
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-none">
                Pre-Owned, Without Compromise.
              </h1>
              <p className="mt-6 text-[20px] md:text-[23px] text-neutral-800 leading-relaxed font-normal">
                Only the best cars, backed by expertise and a customer-<br className="hidden lg:inline" />first experience.
                That&apos;s how {SITE_CONFIG?.dealership.name} does it.
              </p>
            </div>

            {/* Right Column: Animated Image */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full flex justify-center md:justify-end"
            >
              <Image
                src={about}
                alt="Cardora dealership illustration with flatbed delivery truck carrying a blue SUV"
                className="w-full max-w-[750px] h-auto object-contain"
                width={550}
                height={320}
                priority
              />
            </motion.div>
          </div>
        </section>

        <div className="mx-auto md:px-1">
          <hr className="text-gray-200" />
        </div>

        {/* Cardora Certified Section: Header static, Badges reveal sequentially on scroll, Image static */}
        <section className="bg-white py-10 md:py-24 px-5">
          <div className="mx-auto max-w-[1240px] md:px-1">
            <h2 className="text-[27px] md:text-4xl lg:text-5xl font-bold lg:tracking-tight text-neutral-950 text-left leading-none">
              All our cars are {SITE_CONFIG?.dealership.name} Certified
            </h2>
            
            <div className="flex flex-col lg:flex-row items-center justify-between mt-12 gap-8 lg:gap-0">
              {/* Left Column: Animated Badge List */}
              <div className="flex flex-col items-start w-full lg:w-auto">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={containerVariants}
                  className="flex flex-col gap-5 lg:gap-4 w-full pr-16 md:pr-0"
                >
                  {certified.map(({ label }, index) => (
                    <motion.div
                      key={index}
                      variants={slideInLeft}
                      whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.15 } }}
                      className="flex items-center gap-3 bg-[#e6f4ff] rounded-full px-5 py-5 w-full sm:w-80 shadow-[0_2px_18px_rgba(0,0,0,0.06)] cursor-default"
                    >
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-base font-medium text-black">
                        {label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column: Static Car Image */}
              <div className="w-full md:max-w-[700px] flex justify-center md:justify-end relative min-h-[250px]">
                <Image
                  src={blueCar}
                  alt="Blue Honda Civic Sedan showcasing Cardora Certified quality"
                  className="w-full h-auto object-contain drop-shadow-2xl md:absolute md:-top-24 md:-right-4"
                  width={1000}
                  height={500}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 1. After-Sale Service Section: Image static, Text Block Animates up repeatedly */}
        <section className="bg-[#eaeff5] py-16 md:py-20 px-0">
          <div className="mx-auto max-w-[1240px] px-6 md:px-1 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12">
            
            {/* Left: Static Image Container */}
            <div className="w-full flex justify-center md:justify-start">
              <div className="overflow-hidden rounded-2xl bg-white shadow-md w-full lg:max-w-[670px] max-w-full">
                <Image
                  src={saleServices}
                  alt="Cardora service team standing proudly inside the dealership lot"
                  className="w-full h-auto object-cover"
                  width={540}
                  height={320}
                />
              </div>
            </div>

            {/* Right: Animated Text Block */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="w-full text-left"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
                After-Sale Service
              </h2>
              <p className="mt-2 lg:mt-5 text-[20px] md:text-[19px] text-neutral-800 leading-relaxed font-normal">
                We&apos;re here for you long after you drive away. Our team is dedicated to
                fast, efficient support and making sure every concern is handled with care.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Reviews Section: Text Block static, Graphic Cloud scales into view repeatedly */}
        <section className="bg-white py-1 lg:my-12 mt-9">
          <div className="mx-auto max-w-[1240px] px-6 md:px-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            
            {/* Left: Static Text Block */}
            <div className="w-full lg:max-w-2xl">
              <h2 className="text-[28px] md:text-[42px] lg:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
                Hundreds of Five-Star Reviews — and Counting
              </h2>
              <p className="mt-2 lg:mt-2 text-[18px] md:text-[20px] text-neutral-800 lg:leading-relaxed font-medium">
                Hundreds of five-star Google reviews and counting—because a great
                experience is never accidental.
              </p>
            </div>

            {/* Right: Animated Graphic Cloud */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleUp}
              className="w-full flex justify-center md:justify-end"
            >
              <Image
                src={reviews}
                alt="100+ Five-Star Reviews from Happy Customers illustration with Google logo"
                className="w-full lg:max-w-[520px] h-auto object-contain"
                width={520}
                height={340}
              />
            </motion.div>
          </div>
        </section>

        {/* 3. Built in Canada Section: Image static, Text Content Block slides/fades up repeatedly */}
        <section className="bg-white py-1 pb-12 md:pb-20 md:py-0">
          <div className="mx-auto max-w-[1400px] px-5 md:px-1 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
            
            {/* Left: Static Graphic Illustration */}
            <div className="w-full flex justify-center md:justify-start">
              <Image
                src={forCanada}
                alt="Cardora dealership illustration featuring the Canadian flag and map silhouette"
                className="w-full lg:max-w-[650px] h-auto object-contain"
                width={540}
                height={320} 
              />
            </div>

            {/* Right: Animated Text Block */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="w-full text-left max-w-2xl"
            >
              <h2 className="text-[25px] md:text-4xl lg:text-[43px] font-bold tracking-tight text-neutral-950">
                Built in Canada, for Canadians
              </h2>
              <p className="mt-3 text-[22px] font-light md:text-xl text-neutral-500">
                A proudly homegrown success story
              </p>
              <p className="mt-4 text-base md:text-md leading-relaxed text-black font-normal">
                {SITE_CONFIG?.dealership.name} was founded on a simple belief: Canadians deserve a better
                pre-owned car experience. So we built one.
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer Area Wrapper */}
      <div className="w-full">
        <GetInTouch />
        <Footer />
      </div>
    </div>
  );
};

export default About;