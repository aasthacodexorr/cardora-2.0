"use client"

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { SITE_CONFIG } from '@/constants';

const VehicleForm = () => {
  return (
    <>
      <Header />
      <div className="bg-white mx-auto px-5 mt-3 mb-32 tracking-wider">
        <h4 className="text-3xl my-4">What vehicle needs service or repair?</h4>
        <div className="space-y-6">
          <label className="block text-base">
            Provide the following details about your vehicle:
          </label>

          <iframe
            src={SITE_CONFIG.urls.tradeFormByVehicle}
            title="Vehicle Trade Form"
            width="100%"
            className="w-full md:w-11/12 border-0"
            style={{
              minHeight: "447px",
            }}
          />
        </div>
      </div>
      <GetInTouch />
      <Footer />
    </>

  );
};

export default VehicleForm;