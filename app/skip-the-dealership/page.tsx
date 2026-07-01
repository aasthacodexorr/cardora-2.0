"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Check, FileText, Home, CarFront } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Footer, Header } from '@/components/layout';
import { GetInTouch } from '@/components/common';
import skipDeal from "@/assets/cards/skipDeal.png";
import newWay from "@/assets/cards/newWay.png";
import { SITE_CONFIG } from '@/constants';

/* Animation Variants */
const dropDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.5, ease: "easeOut" } 
    }
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } }
};

const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: "easeOut" } }
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

export default function SkipTheDealership() {
    return (
        <>
            <Header />
            <div className="w-full font-sans antialiased text-gray-900 selection:bg-yellow-200 lg:mt-32 overflow-hidden">

                {/* 1. Hero / Banner Section: Buttons animate top-to-bottom */}
                <section className="bg-[#ffde5b] lg:py-18 py-9 px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                            Skip the dealership.
                        </h1>
                        <p className="text-[20px] text-center md:text-[20.4px] text-gray-800 max-w-2xl mx-auto my-8 font-medium">
                            Buy your next car 100% online — or visit us on your terms. No pressure. No wasted time. Just a smarter way to buy.
                        </p>
                        
                        {/* Animated Buttons Area */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={dropDown}
                            className="flex flex-col sm:flex-row justify-center gap-4 px-18 lg:px-0 mt-14 lg:mt-0"
                        >
                            <Link
                                href="/inventory"
                                className="bg-white text-[#00b066] px-8 py-3 rounded-md shadow-sm hover:shadow-md hover:bg-[linear-gradient(180deg,#00af66a6,#00af66)] hover:text-white transition-all duration-200 border border-[#00b066]"
                            >
                                Browse Inventory
                            </Link>
                            <Link
                                href="/financing"
                                className="bg-white text-[#00b066] px-8 py-3 rounded-md shadow-sm hover:shadow-md hover:bg-[linear-gradient(180deg,#00af66a6,#00af66)] hover:text-white transition-all duration-200 border border-[#00b066]"
                            >
                                Get Pre-Approved
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* 2. What Does Skip Mean: Text is static, Image slides/fades in from right */}
                <section className="bg-white px-6 py-6 lg:py-16 lg:px-32">
                    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl md:text-5xl font-bold mb-4 tracking-tight">
                                What Does &ldquo;SKIP THE DEALERSHIP&rdquo; Mean ?
                            </h2>
                            <p className="mb-6 text-xl tracking-wider">
                                It doesn&rsquo;t mean dealerships are bad.<br />
                                It means the old way of buying cars is outdated.
                            </p>

                            <h3 className="text-xl font-bold mb-4">At {SITE_CONFIG?.dealership.name}, you don&rsquo;t have to:</h3>

                            <ul className="mb-6">
                                {[
                                    "Spend hours going lot to lot",
                                    "Deal with sales pressure",
                                    "Negotiate back and forth",
                                    "Wait days for financing approvals"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-center justify-between border-b border-gray-100 py-4">
                                        <span className="font-medium">{text}</span>
                                        <Check className="w-5 h-5 text-emerald-500 stroke-[3]" />
                                    </li>
                                ))}
                            </ul>

                            <p className="">
                                Instead, you can do everything from your phone — in minutes.
                            </p>
                        </div>

                        {/* Animated Image Container */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideInRight}
                            className="relative h-[350px] md:h-[420px] w-full rounded-lg overflow-hidden shadow-lg"
                        >
                            <Image
                                src={skipDeal}
                                alt="Buy car online Canada"
                                fill
                                sizes="(max-w-768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </div>
                </section>

                {/* 3. The New Way to Buy a Car: Image is static, Feature Blocks Content animates up */}
                <section className="bg-[#EBF5FF] py-1 px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-6 items-center py-5">

                        {/* Static Image Box */}
                        <div className="relative h-[450px] md:h-[750px] w-full rounded-lg overflow-hidden order-first md:order-1">
                            <div className="lg:p-20 h-full relative">
                                <Image
                                    src={newWay}
                                    alt="Skip dealership car buying"
                                    className="w-full h-full object-cover rounded-2xl"
                                    width={200}
                                    height={200}
                                />
                            </div>
                        </div>

                        {/* Animated Content Column */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                            className="order-1 md:order-2 pb-10 md:pb-0"
                        >
                            <h2 className="text-2xl lg:text-4xl font-bold mb-4">The New Way to Buy a Car</h2>
                            <p className="mb-8 font-medium text-lg lg:text-2xl">This is how car buying should feel</p>

                            <div className="space-y-4">
                                {/* Feature 1 */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50/50 flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-bold text-xl text-gray-900 mb-1">Choose Your Car</h4>
                                        <p className="text-base">Browse real inventory with transparent pricing.</p>
                                    </div>
                                    <CarFront className="w-8 h-8" />
                                </div>

                                {/* Feature 2 */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50/50 flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-bold text-xl text-gray-900 mb-1">Get Approved Instantly</h4>
                                        <p className="text-base">No impact, fast approvals — even with bad credit.</p>
                                    </div>
                                    <FileText className="w-8 h-8" />
                                </div>

                                {/* Feature 3 */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50/50 flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-bold text-xl text-gray-900 mb-1">Pick Delivery or Pickup</h4>
                                        <p className="text-base">Get it delivered to your door or come in when you&rsquo;re ready.</p>
                                    </div>
                                    <Home className="w-8 h-8" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>

                {/* 4. Comparison Section: Header text is static, Two Cards stagger/scale into view */}
                <section className="bg-white py-6 md:py-16 px-4">
                    <div className="w-full md:max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-[30px] md:text-4xl font-bold mb-2">Side-By-Side Comparison</h2>
                            <p className="font-medium text-lg md:text-xl">Old Way vs {SITE_CONFIG?.dealership.name} Way</p>
                        </div>

                        {/* Animated Grid Cards */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-7"
                        >
                            {/* Traditional Dealership Column */}
                            <motion.div variants={scaleUp} className="bg-[#e6f4ff] rounded-2xl p-6 md:p-4 border border-gray-200/60">
                                <h5 className="text-xl font-bold text-gray-900 border-b border-gray-200 py-7">
                                    Traditional Dealership
                                </h5>
                                <ul className="">
                                    {[
                                        "Spend 3–5 hours in-store",
                                        "Pushy sales tactics",
                                        "Back-and-forth pricing",
                                        "Multiple visits required",
                                        "Stressful experience"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center font-medium border-b border-slate-200 py-4">
                                            <span>{item}</span>
                                            <span className="text-xl select-none">🙁</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Cardora Column */}
                            <motion.div variants={scaleUp} className="bg-[#e6f4ff] rounded-2xl p-6 md:p-4 border border-blue-100">
                                <h5 className="text-xl font-bold text-black border-b border-slate-200 py-7">
                                    {SITE_CONFIG?.dealership.name}
                                </h5>
                                <ul className="">
                                    {[
                                        "Done in under 30 minutes",
                                        "No pressure, ever",
                                        "Transparent pricing",
                                        "One seamless process",
                                        "Easy, fast, online"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center border-b border-slate-200 py-4">
                                            <span>{item}</span>
                                            <span className="text-xl select-none">🙂</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

            </div>
            <GetInTouch />
            <Footer />
        </>
    );
}