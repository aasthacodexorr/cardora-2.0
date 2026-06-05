"use client";

import { useState } from "react";
import Image from "next/image";
import ratesIcon from "@/assets/icons/rates-icon.png";
import onlineIcon from "@/assets/icons/online-icon.png";
import yearIcon from "@/assets/icons/year-icon.png";
import vdpCar from "@/assets/icons/vdp-car.png";

interface FinanceCalculatorProps {
  vehiclePrice?: number;
  inventoryId?: string;
}

const FinanceCalculator = ({ vehiclePrice = 24990, inventoryId = "2851" }: FinanceCalculatorProps) => {
  // State management
  const [purchasePrice, setPurchasePrice] = useState<number>(vehiclePrice);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(5); // in years
  const [interestRate, setInterestRate] = useState<number>(7.99); // percentage

  // Calculation logic
  const loanAmount = Math.max(0, purchasePrice - depositAmount);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Calculate monthly payment using amortization formula
  let monthlyPayment = 0;
  if (loanAmount > 0 && monthlyRate > 0) {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  // Convert to bi-weekly (26 periods per year, 12 months per year)
  // Bi-weekly = Monthly * 12 / 26
  const biWeeklyPayment = (monthlyPayment * 12) / 26;

  // Handle term button click
  const handleTermClick = (years: number) => {
    setLoanTerm(years);
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestRate(parseFloat(e.target.value));
  };

  // Handle input changes
  const handlePurchasePriceChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setPurchasePrice(num);
  };

  const handleDepositAmountChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setDepositAmount(num);
  };

  const sliderPercent = ((interestRate - 6) / (15 - 6)) * 100;

  return (
    <div className="w-full bg-[#faf9f8] md:py-14 py-6 mt-10 font-sans px-2 md:px-0 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row pl-2 ">
          {/* Left column: Content section */}
          <div className="flex flex-col gap-3 max-w-[700px]">
            <h2 className="text-3xl md:text-[30px] font-semibold text-gray-900 tracking-wider mt-6">
              Tailored car finance that puts you in the driver's seat.
            </h2>
            <p className="text-base text-gray-600 max-w-[600px]">
              We support you at every step, offering multiple finance options to help you make an informed decision.
            </p>

            <ul className="flex flex-col md:flex-row gap-4 my-8 max-w-[680px]">
              <li className="flex items-start gap-1 text-[14px] text-gray-700 font-medium leading-tight">
                <Image src={ratesIcon} alt="Rates Icon" className="w-10 h-10 object-contain -mt-[3px] flex-shrink-0" />
                <span>Open and transparent interest rates and fees</span>
              </li>
              <li className="flex items-start gap-1 text-[14px] text-gray-700 font-medium leading-tight">
                <Image src={onlineIcon} alt="Process Icon" className="w-10 h-10 -mt-[3px] object-contain flex-shrink-0" />
                <span>Quick and simple paperless process</span>
              </li>
              <li className="flex items-start gap-1 text-[14px] text-gray-700 font-medium leading-tight">
                <Image src={yearIcon} alt="Approval Icon" className="w-10 h-10 -mt-[3px] object-contain flex-shrink-0" />
                <span>Fast approvals typically by the same business day</span>
              </li>
            </ul>

            <div className="mt-4">
              <Image src={vdpCar} alt="Vehicle Graphic" className="xl:max-w-[750px]" />
            </div>
          </div>

          {/* Right column: Calculator form */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 flex flex-col gap-7 shadow-sm">
            <h3 className="text-3xl font-semibold text-gray-900">How much do you want to spend?</h3>

            {/* Purchase Price and Deposit */}
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-2">
                <label className=" text:text-xl md:text-xs font-semibold text-gray-500 tracking-wider">Purchase price</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => handlePurchasePriceChange(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-200 outline-none focus:border-emerald-500 transition-colors text-gray-800 font-medium text-base"
                  placeholder="$ 25,000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className=" text:text-xl md:text-xs font-semibold text-gray-500 tracking-wider">Deposit amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => handleDepositAmountChange(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-200 outline-none focus:border-emerald-500 transition-colors text-gray-800 font-medium text-base"
                  placeholder="$ 0"
                />
              </div>
            </div>

            {/* Term of Loan */}
            <div className="flex flex-col gap-2 mt-4">
              <label className="text:text-xl md:text-xs font-semibold text-gray-500 tracking-wider">Term of Loan (years)</label>
              <div className="grid grid-cols-5 gap-2">
                {[4, 5, 6, 7, 8].map((year) => (
                  <button
                    key={year}
                    onClick={() => handleTermClick(year)}
                    className={`flex items-center justify-center border rounded-xl py-4 px-4 font-semibold cursor-pointer text-center transition-colors text-xl sm:text-base ${
                      loanTerm === year
                        ? "border-2 border-emerald-500 text-emerald-600 font-bold"
                        : "border border-emerald-200 text-gray-600 hover:bg-emerald-50"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="mt-3 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <label className="text-base text-black">Interest rate</label>
                  <p className="text-base text-black">Slide between 6% and 15%</p>
                </div>
                <div className="border border-gray-200 bg-white rounded-xl px-5 py-3 font-bold text-gray-900 flex items-center gap-0.5 shadow-sm text-xl">
                  <span>{interestRate.toFixed(2)}</span>
                  <span className="text-gray-500 font-medium text-sm ml-0.5">%</span>
                </div>
              </div>

              <div className="relative py-4">
                <div className="relative w-full h-9 flex items-center">
        
        {/* Visual Track Layer (Handles the dynamic green/gray fill background) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(
              to right,
              #52C498 0%,
              #52C498 ${sliderPercent}%,
              #E2F3EB ${sliderPercent}%,
              #E2F3EB 100%
            )`,
          }}
        />

        {/* Dots Layer (Sits ON TOP of the track fill, but under the interactive thumb) */}
        <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none z-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-emerald-700 opacity-60"
            />
          ))}
        </div>

        {/* The Native Range Input (Completely transparent track, only the thumb is visible) */}
        <input
          type="range"
          min={6}
          max={15}
          step="0.01"
          value={interestRate}
          onChange={handleSliderChange}
          className="finance-slider relative z-20 w-full h-9 appearance-none bg-transparent cursor-pointer"
        />
      </div>
                </div>
 
 
            </div>

            {/* Bi-weekly Repayment Result */}
            <div className="bg-emerald-50/40 border border-emerald-50/80 rounded-2xl p-5 text-center flex flex-col gap-3">
              <h4 className="text-base font-semibold text-black/50 tracking-wide">Your estimated Bi-weekly repayment</h4>
              <h2 className="text-5xl sm:text-4xl font-extrabold text-gray-900 tracking-tight my-1">
                ${biWeeklyPayment.toFixed(2)}
                <span className="text-5xl sm:text-4xl font-bold">/Bi-weekly*</span>
              </h2>
              <div className="text-base text-black tracking-wide uppercase">
                <span>O.A.C + HST + licensing</span>
              </div>
              <a
                href={`https://www.cardora.ca/finance?inventory_id=${inventoryId}`}
                className="mt-2 block w-full bg-gradient-to-b from-[#00af66] to-[#00af66]/65 hover:opacity-90 text-white font-bold text-base py-4 px-6 rounded-xl transition-all duration-150 shadow-md shadow-emerald-600/10 text-center no-underline"
              >
                Get personalised quotes
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;
