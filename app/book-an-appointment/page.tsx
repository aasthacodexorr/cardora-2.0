"use client";

import { useEffect } from "react";
import { GetInTouch } from "@/components/common";
import { Footer, Header } from "@/components/layout";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

const VehicleForm = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from your iframe
      if (event.origin !== "https://cardora.zopsoftware.com") {
        return;
      }

      const { type, value, element_id } = event.data || {};

      if (type === "css" && element_id === "service_appointment") {
        const iframe = document.getElementById(
          element_id
        ) as HTMLIFrameElement | null;

        if (iframe && typeof value === "number") {
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

      <div className="bg-white mx-auto w-full px-5 lg:px-64 flex justify-center mt-3 tracking-wider lg:mt-32">
        <iframe
          id="service_appointment"
          src={SITE_CONFIG.urls.bookAppointment}
          title="Vehicle Trade Form"
          className="w-[900px] h-[140vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        />
      </div>

      <GetInTouch />
      <Footer />
    </>
  );
};

export default VehicleForm;