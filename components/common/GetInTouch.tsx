/* =========================
   GetInTouch Component (Common)
   Reusable contact section used on multiple pages.
   Displays:
   - Business hours (Sales / Service tabs)
   - Four contact method cards: Call, WhatsApp, Email, Text
   Used on: Home, Service, Trade-In, Financing, VDP pages.
========================= */

"use client";

import { useState } from "react";
import Image from "next/image";

import callIcon from "@/assets/icons/call_icon.svg";
import messageIcon from "@/assets/icons/message_icon.svg";
import envelopIcon from "@/assets/icons/envelop_icon.svg";
import whatsappIcon from "@/assets/icons/whatsapp_icon.svg";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

/*  Component */
const GetInTouch = () => {
  const appConfig = useAppConfig();
  const { BUSINESS_HOURS_SALES, BUSINESS_HOURS_SERVICES } = getConstants(appConfig);
  const [tab, setTab] = useState<"Sales" | "Service">("Sales");
  const d = appConfig.dealership;

  /* Contact cards with mapped values from config */
  const contactCards = [
  {
    title: "Call us",
    subtitle: "Call Us Anytime Now",
    icon: callIcon,
    href: `tel:${d.sales_number_1}`,
    order: "order-1",
  },
  {
    title: "WhatsApp",
    subtitle: "Chat on WhatsApp",
    icon: whatsappIcon,
    href: `https://wa.me/${d.sales_number_1?.replace(/\D/g, "")}`,
    order: "order-3 md:order-2",
  },
  {
    title: "Email",
    subtitle: "Send Us an Email",
    icon: envelopIcon,
    href: `mailto:${d.email_1}`,
    order: "order-2 md:order-3",
  },
  {
    title: "Text",
    subtitle: "Text Us Right Now",
    icon: messageIcon,
    href: `sms:${d.sales_number_1}`,
    order: "order-4",
  },
];

  return (
    <section className="w-full bg-[#121319] text-white">
      <div className="mx-auto max-w-[1600px] md:px-10 px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">

          {/* Left: business hours */}
          <div>
            <h2 className="text-[28px] lg:text-[30px] font-bold leading-tight max-[767px]:text-[20px]">
              Get in touch with us, we're here to help
            </h2>

            <div className="mt-8 rounded-xl border border-[#2a2b30] bg-transparent p-[10px]">
              {/* Sales / Service tab switcher */}
              <div className="flex gap-2">
                {(["Sales", "Service"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-[30px] py-[5px] rounded-[10px] text-[15px] font-semibold transition-colors border-none cursor-pointer relative z-[11] leading-[1.7em] max-w-full ${
                      tab === t
                        ? "bg-[#2a2b30] text-[#01a960]"
                        : "bg-[#2a2b30] text-white hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Hours table */}
              <div className="mt-5 space-y-3">
                {Object.values(tab === "Sales" ? BUSINESS_HOURS_SALES : BUSINESS_HOURS_SERVICES).map(({ label, hours }) => (
                  <div key={label} className="grid grid-cols-[1fr_2fr]">
                    <span className="text-[16px] ">{label}:</span>
                    <span className="text-[16px] text-white">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: contact method cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
            {contactCards.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={`${item.order} rounded-xl border border-[#2a2b30] bg-transparent p-6 flex items-center justify-between hover:bg-white/10 transition-colors`}
              >
                <div className="flex items-center justify-between w-full flex-wrap">
                  <div>
                    <h3 className="text-[20px] font-bold text-white">{item.title}</h3>
                    <p className="text-[16px]  mt-[5px] font-[Lato,sans-serif]">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Icon circle */}
                  <div className="h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={27}
                      height={27}
                      className="object-contain"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
