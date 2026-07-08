"use client";

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

  console.log("vehicle id is ", SITE_CONFIG.urls.tradeInMyCarVehicle);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Vehicle Trade-In Content Section */}
      <section className="w-full relative px-4 lg:px-24 mt-10 lg:mt-28">
        <div className="mx-auto max-w-[900px] px-2 md:px-9 md:py-5 md:pb-14 pb-5 ">
          {/* Iframe Container */}
            <iframe
              src={SITE_CONFIG.urls.tradeInMyCarVehicle}
              title="Trade In Vehicle Form"
              width="100%"
              height="600"
              className="border-0 cursor-pointer rounded-lg"
            />
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default TradeInVehicle;
