"use client";

import { GetInTouch } from "@/components/common";
import { Footer, Header } from "@/components/layout";
import { useAppConfig } from "../providers";
import { getConstants } from "@/constants";
import { Lock, Mail, Smartphone } from "lucide-react";

export default function ThankYouTradeIn() {
    const appConfig = useAppConfig();
    const { SITE_CONFIG } = getConstants(appConfig);

    return (
        <>
            <Header />

            <div className="bg-gradient-to-b from-[#e6f4ff] to-white lg:mt-20 pt-14 lg:pt-28 lg:pb-14 px-4 pb-10 lg:px-44 w-full flex flex-col justify-center items-center">
                <h1 className="lg:text-[40px] text-[26px] text-center font-semibold text-[#00af66] leading-none">
                    Your Vehicle Value Is Being
                    <br />
                    Calculated
                </h1>

                <p className="text-center font-medium max-w-xl text-[17px] mt-4">
                    Our smart pricing system is analyzing your vehicle details and
                    matching them with real-time market data. A Cardora specialist will
                    contact you shortly to review your offer and next steps.
                </p>
            </div>

            <div className="w-full lg:px-80 lg:pb-20 px-4 pb-8 min-h-screen ">
                <iframe
                    src={SITE_CONFIG?.urls.thankYouTradeIn}
                    className="w-full min-h-[115vh]"
                    title="Express Checkout - Finance"
                    allow="payment"
                />
            </div>

            <div className="mx-auto w-fit mb-20">
                <ul className="flex flex-col items-center gap-[6px] text-[13px] font-light leading-[1.4] text-[#8c8c8c]">
                    <li className="inline-flex items-center gap-[4px]">
                        <Lock size={15} strokeWidth={2} />
                        <span>Safe • Encrypted • Takes under a minute</span>
                    </li>

                    <li className="inline-flex items-center gap-[4px]">
                        <Mail size={14} strokeWidth={2} />
                        <span>A confirmation email has been sent to your inbox.</span>
                    </li>

                    <li className="inline-flex items-center gap-[4px]">
                        <Smartphone size={14} strokeWidth={2} />
                        <span>One of our Cardora specialists will reach out shortly with the next steps.</span>
                    </li>
                </ul>
            </div>

            <GetInTouch />
            <Footer />
        </>
    );
}