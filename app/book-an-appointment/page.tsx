"use client"

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { getConstants } from '@/constants';
import { useAppConfig } from '@/app/providers';

const VehicleForm = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  return (
    <>
      <Header />
      <div className="bg-white mx-auto w-full px-5  lg:px-64 flex justify-center mt-3 tracking-wider lg:mt-32">
        <iframe
          src={SITE_CONFIG.urls.bookAppointment}
          title="Vehicle Trade Form"
          className='w-[900px] h-[140vh] "[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-track]:hidden",
                "lg:[scrollbar-width:none] lg:[-ms-overflow-style:none]"'
        />
      </div>
      <GetInTouch />
      <Footer />
    </>

  );
};

export default VehicleForm;