/* =========================
   Financing Page
   Embeds the Cardora financing application form
   via an iframe. Listens for postMessage events
   from the iframe to dynamically resize the iframe
   height, preventing scroll bars inside the embed.
========================= */

"use client";

import { useEffect, useRef, useState } from "react";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Config
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Reviews } from "@/components/home";
import { ChevronDown } from "lucide-react";

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

/*  Constants */
const MIN_HEIGHT = 300;
const FALLBACK_HEIGHT = 900;


const faqs = [
    {
        q: "How does selling my car to cardora work?",
        a: "cardora makes selling your car fast and easy. Simply enter your vehicle details, get an instant online offer, schedule a quick inspection, and get paid on the spot. No obligations, no pushy salespeople.",
    },
    {
        q: "What documents do I need to sell my car?",
        a: "You'll need: Valid government ID, Vehicle Ownership, All keys & fobs. If your car has a loan or lease, bring the payoff letter and we'll handle the rest.",
    },
    {
        q: "Do you buy cars that still have a loan or financing on them?",
        a: "Yes! cardora will pay off your existing loan or lease directly with the bank. If your car is worth more than the payoff, you keep the difference. If it's worth less, we'll guide you on the best options.",
    },
    {
        q: "How long is my online offer valid for?",
        a: "Your cardora offer is valid for 7 days. This gives you enough time to compare options or shop around without feeling rushed.",
    },
    {
        q: "How quickly do I get paid?",
        a: "You get paid the same day you bring your car in. Payment can be made via EMT, cheque, or direct deposit—whichever is easiest for you.",
    },
    {
        q: "Can I trade in my vehicle instead of selling it?",
        a: "Yes! You can trade in your current vehicle and use the value toward your next purchase. We handle all paperwork and give you the highest value possible to maximize your savings.",
    },
    {
        q: "Do I need to buy a car from cardora to sell you mine?",
        a: "Not at all. We buy cars even if you're not purchasing one from us. Many customers simply want cash or want to get rid of an unused vehicle.",
    },
    {
        q: "How does cardora determine my vehicle's value?",
        a: "We use real-time market data, vehicle history, condition reports, and recent sales in your area to give you an accurate and competitive offer. No guesswork—just transparent pricing.",
    },
    {
        q: "What if I owe more on my car than it's worth?",
        a: "This is very common. We can still buy your car. We'll calculate the shortfall and help you determine the best way to clear the loan. If trading in, you may be able to roll the balance into your next vehicle.",
    },
];

/*  Page Component */
const UsedCarFinance = () => {
    const appConfig = useAppConfig();
    const { SITE_CONFIG } = getConstants(appConfig);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = useState<number>(FALLBACK_HEIGHT);
    const [openFaq, setOpenFaq] = useState<number | null>(0);


    // Listen for height updates from the embedded financing form
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            if (
                data &&
                typeof data === "object" &&
                data.type === "css" &&
                data.element_id === "financing_form" &&
                typeof data.value === "number"
            ) {
                setHeight(Math.max(MIN_HEIGHT, Math.ceil(data.value) + 24));
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* <Header /> */}

            <section className="lg:mt-28">
                <div className="mx-auto max-w-[1100px] px-4 md:px-6">
                    <div className="overflow-hidden">
                        <iframe
                            ref={iframeRef}
                            id="financing_form"
                            src={`${SITE_CONFIG.urls.usedCarFinance}?`}
                            name="iframe_a"
                            title="Cardora financing application"
                            scrolling="no"
                            className="w-full block transition-[height] duration-300 ease-out border-0"
                            style={{
                                minHeight: MIN_HEIGHT,
                                height: `${height}px`,
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="px-4">
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
                        <motion.div variants={scaleUp} className="rounded-2xl p-6 md:p-4 bg-[#e6f4ff] border border-border-light">
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
                        <motion.div variants={scaleUp} className="rounded-2xl p-6 md:p-4 bg-[#e6f4ff] border border-border-light">
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

            <Reviews />

            <section className="w-full lg:mb-18 mb-2 lg:mt-10 px-3 lg:px-24">
                <div className="mx-auto max-w-[1400px] px-2 md:px-9 py-8 lg:py-0">
                    <div className="flex items-center gap-3 mb-6 md:mb-10">
                        <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-semibold text-foreground leading-tight">
                            Popular sell or trade in questions
                        </h2>
                    </div>

                    {/* Staggered Row Entry Container */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        variants={containerVariants}
                        className="space-y-1"
                    >
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={faq.q}
                                variants={fadeInUp}
                                className="border overflow-hidden bg-white border-border-light"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className={`w-full flex items-center justify-between px-4 md:px-6 text-left cursor-pointer transition-colors duration-200 ${openFaq !== i ? "bg-background-light" : "bg-white"
                                        }`}
                                >
                                    <span className={`font-bold leading-none transition-colors duration-200 ${openFaq !== i ? "py-5 md:py-6 text-neutral-darkGray4" : "py-4 md:py-5 text-neutral-darkGray2"
                                        } text-[18px] md:text-[20px] pr-4`}>
                                        {faq.q}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="flex-shrink-0 text-foreground/60"
                                    >
                                        <ChevronDown className="h-5 w-5" />
                                    </motion.div>
                                </button>

                                {/* Accordion Expansion Drawer */}
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="overflow-hidden bg-white"
                                        >
                                            <div className="px-4 md:px-6 pb-5 text-[16px] md:text-[16px] leading-normal text-neutral-darkGray3">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default UsedCarFinance;
