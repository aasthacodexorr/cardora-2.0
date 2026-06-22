"use client";

import { useState } from "react";

export default function CoverageModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Link */}
      <button
        onClick={() => setIsOpen(true)}
        className="font-semibold text-black underline cursor-pointer hover:text-emerald-500 transition-colors duration-150 inline-block ml-1 bg-transparent border-none p-0 outline-none align-baseline text-[15px]"
      >
        Learn more
      </button>

      {/* Modal Overlay and Container */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        {/* Modal Window with "Top to Center" Slide & Fade transition */}
        <div
          className={`bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 transition-all duration-300 transform ${
            isOpen ? "translate-y-0 scale-100 opacity-100" : "-translate-y-12 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Header */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Cardora Extended Coverage
          </h3>
          <p className="text-black font-normal  md:text-base mb-6 leading-relaxed">
            Purchase Cardora Extended Coverage and drive with confidence knowing your car is protected.
          </p>

          {/* Perks List */}
          <div className="space-y-6">
            {/* Perk 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                  Premium mechanical protection
                </h4>
                <p className="text-black  font-normal  mt-1 leading-relaxed">
                  Platinum mechanical protection, equivalent to a new car coverage. With higher claims - up to the purchase price of the vehicle.
                </p>
              </div>
            </div>

            {/* Perk 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                  Premium Roadside Assist
                </h4>
                <p className="text-black font-normal   mt-1 leading-relaxed">
                  Nationwide breakdown help for the life of your coverage. Also includes extra such as a courtesy car.
                </p>
              </div>
            </div>

            {/* Perk 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                  Choice of term
                </h4>
                <p className="text-black font-normal mt-1 leading-relaxed">
                  Choose from either 1, 3 or 5 years coverage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}