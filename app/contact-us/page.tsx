"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import Image from 'next/image';
import callIcon from "@/assets/icons/call_icon.svg";
import envelopIcon from "@/assets/icons/envelop_icon.svg";
import { getConstants } from '@/constants';
import { useAppConfig } from '@/app/providers';
import Link from 'next/link';


export default function ContactUs() {
    const router = useRouter();
    const appConfig = useAppConfig();
    const SITE_CONFIG = getConstants(appConfig).SITE_CONFIG;
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("Origin:", event.origin);
            console.log("Data:", event.data);
            if (event.origin !== SITE_CONFIG?.api?.saasApi) return;
            switch (event.data) {
                case "redirectToThankYouPage":
                    router.push("/thank-you");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [router]);

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center px-3 py-10 lg:px-24 font-sans text-gray-900 lg:mt-24">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8">

                    {/* Left Side */}
                    <div className="space-y-8">
                        <h1 className="text-2xl sm:text-[42px] font-bold lg:mt-28 lg:max-w-xl">
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
                                    <h2 className="text-xl font-bold mb-1">Call us</h2>
                                    <p className="text-gray-600">{appConfig.dealership.sales_number_1 || "Call Us Anytime Now"}</p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
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
                                    <h2 className="text-xl font-bold mb-1">Email</h2>
                                    <p className="text-gray-600">{appConfig.dealership.email_1 || "Send Us an Email"}</p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
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

                    {/* Right Side: Form Container */}
                    <div className=" bg-white px-4 pt-8 pb-18 sm:p-6 rounded-3xl shadow-[0_2px_18px_rgba(0,0,0,0.1)] border border-gray-100">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Let’s Get You on the Road</h2>
                        <div className="h-[600px]">
                            <iframe
                                src={`${SITE_CONFIG?.urls.contactUsBaseUrl}`}
                                className="w-full rounded-2xl h-full"
                                title="Contact Us"
                                allow="payment"
                            />
                        </div>
                    </div>

                </div>
            </div>

            <GetInTouch />
            <Footer />
        </>
    );
}