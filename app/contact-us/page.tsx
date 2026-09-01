"use client";

import { useEffect } from "react";
import { GetInTouch } from "@/components/common";
import { Footer, Header } from "@/components/layout";
import Image from "next/image";
import callIcon from "@/assets/icons/call_icon.svg";
import envelopIcon from "@/assets/icons/envelop_icon.svg";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import Link from "next/link";

export default function ContactUs() {
    const appConfig = useAppConfig();
    const SITE_CONFIG = getConstants(appConfig).SITE_CONFIG;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://cardora.zopsoftware.com") {
                return;
            }

            const { type, value, element_id } = event.data || {};

            if (
                type === "css" &&
                element_id === "contact_us" &&
                typeof value === "number"
            ) {
                const iframe = document.getElementById(
                    element_id
                ) as HTMLIFrameElement | null;

                if (iframe) {
                    iframe.style.height = `${value}px`;
                }
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <>
            <Header />

            <div className="min-h-screen flex items-center justify-center px-4 py-10 lg:px-8 font-sans text-gray-900 lg:mt-24">
                {/* Max width container constraint added */}
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8 items-start">

                    {/* Left Side */}
                    <div className="space-y-8">
                        <h1 className="text-2xl sm:text-[42px] font-bold lg:mt-12 lg:max-w-xl">
                            Got a question? We’re here to help.
                        </h1>

                        <div className="space-y-7 lg:space-y-4 lg:w-[480px]">

                            {/* Call Card */}
                            <Link
                                href={`tel:${appConfig.dealership.sales_number_1}`}
                                className="group relative bg-white p-6 rounded-md border border-gray-200 flex justify-between overflow-hidden cursor-pointer block"
                            >
                                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-1">
                                        Call us
                                    </h2>
                                    <p className="text-gray-600">
                                        Call Us Anytime Now
                                    </p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-brand-green flex items-center justify-center">
                                    <Image
                                        src={callIcon}
                                        alt="Call icon"
                                        width={27}
                                        height={27}
                                        className="object-contain"
                                    />
                                </div>
                            </Link>

                            {/* Email Card */}
                            <Link
                                href={`mailto:${appConfig.dealership.email_1}`}
                                className="group relative bg-white p-6 rounded-md border border-gray-200 flex justify-between overflow-hidden cursor-pointer block"
                            >
                                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-1">
                                        Email
                                    </h2>
                                    <p className="text-gray-600">
                                        Send Us an Email
                                    </p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-brand-green flex items-center justify-center">
                                    <Image
                                        src={envelopIcon}
                                        alt="Email icon"
                                        width={27}
                                        height={27}
                                        className="object-contain"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                            Let’s Get You on the Road
                        </h2>

                        {/* Iframe wrapper auto-adjusts height cleanly */}
                        <div className="w-full overflow-hidden">
                            <iframe
                                id="contact_us"
                                src={SITE_CONFIG?.urls.contactUsBaseUrl}
                                className="w-full min-h-[550px] rounded-2xl border-0"
                                title="Contact Us"
                                allow="payment"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}