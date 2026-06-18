// components/VehicleInfo.tsx
"use client"; // <--- This allows us to use useState right here!

import { useState } from "react";
import Image from "next/image";
import checkout from "@/assets/icons/checkout.png";
import { Fuel } from "lucide-react";

interface FuelIconProps {
  size?: number;
}

const FuelIcon = ({ size = 4 }: FuelIconProps) => (
  <svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    fill="currentColor"
  >
    <path d="M153.6 42.4C162.5 31.5 176.8 24 192 24s29.5 7.5 38.4 18.4l96 117.3c35.5 43.4 57.6 98.9 57.6 159.3C384 425 298 512 192 512S0 425 0 319c0-60.4 22.1-115.9 57.6-159.3L153.6 42.4z" />
  </svg>
);

// 1. PriceAndCTA now owns the state internally
export const PriceAndCTA = ({ vehicle }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl px-5 pb-2 text-center shadow-sm">
      {
        vehicle?.selling_price?.toLocaleString() === vehicle?.price?.toLocaleString()
          ? null :
          <p className="text-[12px] font-extrabold text-black line-through leading-none my-3">
            ${vehicle?.price?.toLocaleString()}.00
          </p>
      }
      
      <div className="flex items-center justify-center gap-1 my-3">
        <p className="text-[32px] font-extrabold text-[#00A651] leading-none">
          ${Number(vehicle?.selling_price || 0).toLocaleString("en-CA")}.00
        </p>

        <div className="relative inline-flex items-center group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-gray-500 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm1 8a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>

          <div className="absolute top-[-52px] -translate-x-[74%] whitespace-nowrap bg-black text-white text-[14px] px-2 py-2 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
            Listed price does not include taxes and licensing fees.
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-black rotate-45" />
          </div>
        </div>
      </div>

      <div className="mt-1">
        <Image src={checkout} alt="Express Checkout" />
      </div>

      <div className="mt-1 space-y-3">
        <a href={`/finance/?inventory_id=${vehicle?.id}`}>
          <button className="cursor-pointer my-3 font-bold w-full rounded-[10px] sm:rounded-[12px] border border-[#00b066] bg-gradient-to-b from-[#00af66] to-[#00af66]/65 text-white py-[12px] sm:py-[10px] text-[15px] sm:text-[20px] hover:opacity-90 shadow-md transition-opacity">
            Get started
          </button>
        </a>

        {/* Triggers local state change */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white cursor-pointer hover:bg-[#00af66a6] hover:text-white border-2 border-[#00af66a6] text-[#00A651] font-bold py-3 rounded-xl transition-colors text-[16px] sm:text-[20px]"
        >
          Send message
        </button>
      </div>

      {/* The modal is safely self-contained right here */}
      <MessageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={vehicle} 
      />
    </div>
  );
};

// 2. This sub-component stays completely decoupled and lightweight
export const VehicleHeader = ({ vehicle }: any) => (
  <div className="bg-[#eaf5ff] rounded-t-xl px-5 py-6 text-center w-full">
    <h1 className="text-[28px] font-bold text-gray-900 leading-tight tracking-wide">
      {vehicle?.year}{vehicle?.make}{vehicle?.model}
    </h1>

    {vehicle?.trim && (
      <p className="text-[16px] text-gray-500 mt-0.5">{vehicle?.trim}</p>
    )}

    <div className="flex items-center justify-center gap-3 mt-4 text-black flex-wrap">
      <div className="flex items-center gap-1 text-[14px]">
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V120c0-13.3-10.7-24-24-24s-24 10.7-24 24v172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64z" />
        </svg>
        <span>{vehicle?.odometer?.toLocaleString()} KM</span>
      </div>

      {vehicle?.fuel_type && (
        <div className="flex items-center gap-1 text-[14px]">
          <Fuel size={15} />
          <span>{vehicle?.fuel_type}</span>
        </div>
      )}

      {vehicle?.transmission && (
        <div className="flex items-center gap-1 text-[14px]">
          <svg
            className="w-4 h-4 text-black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            fill="currentColor"
          >
            <path d="M415.9 210.5c12.2-3.3 25 2.5 30.5 13.8L465 261.9c10.3 1.4 20.4 4.2 29.9 8.1l35-23.3c10.5-7 24.4-5.6 33.3 3.3l19.2 19.2c8.9 8.9 10.3 22.9 3.3 33.3l-23.3 34.9c1.9 4.7 3.6 9.6 5 14.7 1.4 5.1 2.3 10.1 3 15.2l37.7 18.6c11.3 5.6 17.1 18.4 13.8 30.5l-7 26.2c-3.3 12.1-14.6 20.3-27.2 19.5l-42-2.7c-6.3 8.1-13.6 15.6-21.9 22l2.7 41.9c.8 12.6-7.4 24-19.5 27.2l-26.2 7c-12.2 3.3-24.9-2.5-30.5-13.8l-18.6-37.6c-10.3-1.4-20.4-4.2-29.9-8.1l-35 23.3c-10.5 7-24.4 5.6-33.3-3.3l-19.2-19.2c-8.9-8.9-10.3-22.8-3.3-33.3l23.3-35c-1.9-4.7-3.6-9.6-5-14.7s-2.3-10.2-3-15.2l-37.7-18.6c-11.3-5.6-17-18.4-13.8-30.5l7-26.2c3.3-12.1 14.6-20.3 27.2-19.5l41.9 2.7c6.3-8.1 13.6-15.6-21.9-22l-2.7-41.8c-.8-12.6 7.4-24 19.5-27.2l26.2-7zM448.4 340a44 44 0 1 0 .1 88 44 44 0 1 0-.1-88zM224.9-45.5l26.2 7c12.1 3.3 20.3 14.7 19.5 27.2l-2.7 41.8c8.3 6.4 15.6 13.8 21.9 22l42-2.7c12.5-.8 23.9 7.4 27.2 19.5l7 26.2c3.2 12.1-2.5 24.9-13.8 30.5l-37.7 18.6c-.7 5.1-1.7 10.2-3 15.2s-3.1 10-5 14.7l23.3 35c7 10.5 5.6 24.4-3.3 33.3L307.3 262c-8.9 8.9-22.8 10.3-33.3 3.3L239 242c-9.5 3.9-19.6 6.7-29.9 8.1l-18.6 37.6c-5.6 11.3-18.4 17-30.5 13.8l-26.2-7c-12.2-3.3-20.3-14.7-19.5-27.2l2.7-41.9c-8.3-6.4-15.6-13.8-21.9-22l-42 2.7c-12.5.8-23.9-7.4-27.2-19.5l-7-26.2c-3.2-12.1 2.5-24.9 13.8-30.5l37.7-18.6c.7-5.1 1.7-10.1 3-15.2 1.4-5.1 3-10 5-14.7L55.1 46.5c-7-10.5-5.6-24.4 3.3-33.3L77.6-6c8.9-8.9 22.8-10.3 33.3-3.3l35 23.3c9.5-3.9 19.6-6.7 29.9-8.1l18.6-37.6c5.6-11.3 18.3-17 30.5-13.8zM192.4 84a44 44 0 1 0 0 88 44 44 0 1 0 0-88z" />
          </svg>
          <span>{vehicle?.transmission}</span>
        </div>
      )}
    </div>
  </div>
);

// 3. MessageModal Overlay
const MessageModal = ({ isOpen, onClose, vehicle }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] px-4 text-left">
      <div className="bg-white rounded-2xl w-full z-[9999] max-w-[540px] relative shadow-2xl p-6 flex flex-col max-h-[90vh]">
        
        <button onClick={onClose} className="absolute right-5 cursor-pointer top-5 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[24px] font-bold text-gray-900 mb-6 mt-2">Got a question</h2>

        <div className="overflow-y-auto pr-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[16px] outline-none focus:border-gray-500"/>
            <input type="text" placeholder="Last Name" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[16px] outline-none focus:border-gray-500"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[16px] outline-none focus:border-gray-500"/>
            <input type="tel" placeholder="Phone Number" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[16px] outline-none focus:border-gray-500"/>
          </div>

          <div>
            <textarea rows={4} defaultValue={`Hi, I'm interested in the ${vehicle?.year || '2018'} ${vehicle?.make || 'Honda'} ${vehicle?.model || 'Civic'}. Please contact me as soon as you can.`} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[16px] outline-none focus:border-gray-500 resize-none"/>
          </div>

          <div className="flex items-start gap-2 text-[12px] text-gray-700 leading-normal">
            <input type="checkbox" defaultChecked className="mt-1 accent-[#00A651]" id="consent" />
            <label htmlFor="consent" className="cursor-pointer">
              By submitting this form, you agree to be contacted through phone calls, SMS, WhatsApp, or email regarding your inquiry, offers, and updates. You can opt out anytime by notifying us.
            </label>
          </div>

          <div className="border border-gray-200 rounded-md p-3 flex items-center justify-between bg-[#f9f9f9] max-w-[300px]">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-6 h-6 border-2 border-gray-300 rounded cursor-pointer accent-blue-600" />
              <span className="text-[14px] text-gray-700 font-medium">I'm not a robot</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 6h-2.607" />
              </svg>
              <span className="text-[9px] text-gray-400 mt-0.5">reCAPTCHA</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-2">
          <button type="submit" className="bg-[#00A651] cursor-pointer hover:bg-[#008942] text-white font-bold py-3 px-8 rounded-xl text-[16px] transition-colors shadow-md">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};