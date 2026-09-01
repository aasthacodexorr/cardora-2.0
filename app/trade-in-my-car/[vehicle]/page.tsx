"use client";

import { useEffect } from "react";
import { Header, Footer } from "@/components/layout";
import { GetInTouch } from "@/components/common";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import { useParams } from "next/navigation";

const TradeInVehicle = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);

  const params = useParams();
  const vehicleId = params.vehicle;

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
        data.element_id === "trade_form_with_vehicle" &&
        typeof data.value === "number"
      ) {
        const iframe = document.getElementById(
          "trade_form_with_vehicle"
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

  console.log("vehicle id is", vehicleId);
  console.log(
    "trade in url is",
    SITE_CONFIG.urls.tradeInMyCarVehicle
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <section className="w-full relative px-4 lg:px-24 mt-10 lg:mt-28">
        <div className="mx-auto max-w-[900px] px-2 md:px-9 md:py-5 md:pb-14 pb-5">
          <iframe
            id="trade_form_with_vehicle"
            src={SITE_CONFIG.urls.tradeInMyCarVehicle}
            title="Trade In Vehicle Form"
            width="100%"
            scrolling="no"
            className="w-full border-0 rounded-lg transition-[height] duration-300 ease-out"
            style={{
              minHeight: "553px",
            }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TradeInVehicle;