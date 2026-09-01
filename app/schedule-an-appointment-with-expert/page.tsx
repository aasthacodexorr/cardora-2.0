"use client";

import { useEffect } from "react";
import { Header, Footer } from "@/components/layout";
import { GetInTouch } from "@/components/common";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

const TradeInVehicle = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the Cardora iframe
      if (event.origin !== "https://cardora.zopsoftware.com") {
        return;
      }

      const data = event.data;

      if (
        data &&
        typeof data === "object" &&
        data.type === "css" &&
        data.element_id === "book_an_appointment" &&
        typeof data.value === "number"
      ) {
        const iframe = document.getElementById(
          "book_an_appointment"
        ) as HTMLIFrameElement | null;

        if (iframe) {
          iframe.style.height = `${Math.ceil(data.value) + 24}px`;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* <Header /> */}

      {/* Vehicle Trade-In Content Section */}
      <section className="w-full relative px-4 lg:px-24 mt-10 lg:mt-28">
        <div className="mx-auto max-w-[900px] px-2 md:px-9 md:py-5 md:pb-14 pb-5">
          <iframe
            id="book_an_appointment"
            src={SITE_CONFIG.urls.scheduleAnAppointmentWithExpert}
            title="scheduleAnAppointmentWithExpert"
            width="100%"
            height="1000"
            scrolling="no"
            className="border-0 rounded-lg w-full transition-[height] duration-300 ease-out"
          />
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default TradeInVehicle;