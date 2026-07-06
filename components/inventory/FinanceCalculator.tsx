"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ratesIcon from "@/assets/icons/rates-icon.png";
import onlineIcon from "@/assets/icons/online-icon.png";
import yearIcon from "@/assets/icons/year-icon.png";
import vdpCar from "@/assets/icons/vdp-car.png";

import { useAppConfig } from "@/app/providers";

interface FinanceCalculatorProps {
  vehiclePrice?: number;
  inventoryId?: string;
}

// Simple internal component to animate price counting numbers smoothly
const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 400; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      
      const current = start + (end - start) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toFixed(2)}</span>;
};

const FinanceCalculator = ({ vehiclePrice, inventoryId = "2851" }: FinanceCalculatorProps) => {
  const appConfig = useAppConfig();
  // State management
  const [purchasePrice, setPurchasePrice] = useState<number>(vehiclePrice || appConfig.payment_calculator.vehicle_price);
  const [depositAmount, setDepositAmount] = useState<number>(appConfig.payment_calculator.downpayment);
  const [loanTerm, setLoanTerm] = useState<number>(appConfig.payment_calculator.duration / 12); // in years
  const [interestRate, setInterestRate] = useState<number>(appConfig.payment_calculator.interest_rate); // percentage

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
  const biWeeklyPayment = (monthlyPayment * 12) / 26;

  const handleTermClick = (years: number) => {
    setLoanTerm(years);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestRate(parseFloat(e.target.value));
  };

  const handlePurchasePriceChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setPurchasePrice(num);
  };

  const handleDepositAmountChange = (value: string) => {
    const num = parseFloat(value) || 0;
    setDepositAmount(num);
  };

  const min = 6;
  const max = 15;

  const sliderPercent = ((interestRate - min) / (max - min)) * 100;

  const fillWidth =
    interestRate === min
      ? "18px"  
      : `calc(${sliderPercent}% + 9px)`;  

  // Animation variants
  const fadeInUp:Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  return (
    <div className="w-full bg-[#faf9f8] md:py-14 py-6 mt-10 font-sans px-2 md:px-10 overflow-hidden">
      <div className="w-full mx-auto max-w-[1620px]">
        <div className="flex flex-col lg:flex-row pl-2 lg:gap-10">
          
          {/* Left column: Content section */}
          <motion.div 
            className="flex flex-col gap-3 max-w-[700px] 2xl:max-w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-[30px] font-semibold text-gray-900 tracking-wider mt-6">
              Tailored car finance that puts you in the driver's seat.
            </h2>
            <p className="text-base text-gray-600 max-w-[600px]">
              We support you at every step, offering multiple finance options to help you make an informed decision.
            </p>

            <motion.ul 
              className="flex flex-col md:flex-row gap-4 my-8 max-w-[680px]"
              variants={staggerContainer}
            >
              {[
                { icon: ratesIcon, text: "Open and transparent interest rates and fees" },
                { icon: onlineIcon, text: "Quick and simple paperless process" },
                { icon: yearIcon, text: "Fast approvals typically by the same business day" }
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeInUp}
                  className="flex items-center lg:items-start  gap-1 text-[14px] text-gray-700 font-medium leading-tight"
                >
                  <Image src={item.icon} alt="Icon" className="w-10 h-10 object-contain -mt-[3px] flex-shrink-0" />
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              className="mt-4"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <Image src={vdpCar} alt="Vehicle Graphic" />
            </motion.div>
          </motion.div>

          {/* Right column: Calculator form */}
          <motion.div 
            className="bg-white lg:rounded-2xl 2xl:max-w-[1200px] p-6 sm:p-10 flex flex-col gap-7 shadow-sm w-full"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-3xl font-semibold text-gray-900">How much do you want to spend?</h3>

            {/* Purchase Price and Deposit */}
            <div className="grid lg:grid-cols-2 lg:gap-10 gap-5 ">
              <div className="flex flex-col gap-2">
                <label className="text-xl md:text-sm font-semibold text-gray-500 tracking-wider">Purchase price</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => handlePurchasePriceChange(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-gray-800 font-medium text-base"
                  placeholder="$ 25,000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xl md:text-sm font-semibold text-gray-500 tracking-wider">Deposit amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => handleDepositAmountChange(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-gray-800 font-medium text-base"
                  placeholder="$ 0"
                />
              </div>
            </div>

            {/* Term of Loan */}
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xl md:text-sm font-semibold text-gray-500">Term of Loan (years)</label>
              <div className="grid grid-cols-5 gap-2">
                {[4, 5, 6, 7, 8].map((year) => {
                  const isActive = loanTerm === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleTermClick(year)}
                      className="relative flex items-center justify-center border border-[#00af6645] hover:bg-[#00af6645]/40 rounded-xl py-4 px-4 font-semibold cursor-pointer text-center text-xl sm:text-base transition-colors"
                      style={{ overflow: "hidden" }}
                    >
                      {/* Smooth background/border bubble selection layer */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 border-2 border-emerald-500 bg-emerald-50/20 rounded-xl pointer-events-none"
                          transition={{ type: "spring", }}
                        />
                      )}
                      <span className={`relative z-10  font-light text-black`}>
                        {year}
                      </span>
                    </button>
                  );
                })}
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
                  {/* Gray Track */}
                  <div className="absolute inset-0 rounded-full bg-[#DCEBE6]" />

                  {/* Green Fill */}
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    animate={{ width: fillWidth }}
                    transition={{ type: "tween", ease: "linear", duration: 0.05 }}
                    style={{
                      background:
                        "linear-gradient(90deg, #A8E5CC 0%, #85DBB8 50%, #05B169 100%)",
                    }}
                  />

                  {/* Dots */}
                  <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none z-10">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#1D8B68]/60" />
                    ))}
                  </div>

                  <input
                    type="range"
                    min={6}
                    max={15}
                    step="0.01"
                    value={interestRate}
                    onChange={handleSliderChange}
                    className="finance-slider absolute inset-0 z-20 w-full h-9 opacity-0 cursor-pointer"
                  />
                </div>  
              </div>
            </div>

            {/* Bi-weekly Repayment Result Box */}
            <motion.div 
              className="bg-[#faf9f8] border border-emerald-50/80 rounded-2xl p-5 text-center flex flex-col gap-3"
              layout
            >
              <h4 className="text-base font-semibold text-black/50 tracking-wide">Your estimated Bi-weekly repayment</h4>
              
              <h2 className="text-5xl sm:text-4xl font-extrabold text-gray-900 tracking-tight my-1">
                $<AnimatedCounter value={biWeeklyPayment} />
                <span className="text-5xl sm:text-4xl font-bold">/Bi-weekly*</span>
              </h2>
              
              <div className="text-base text-black tracking-wide uppercase">
                <span>O.A.C + HST + licensing</span>
              </div>
              
              <motion.a
                href={`/finance?inventory_id=${inventoryId}`}
                className="mt-2 block w-full bg-gradient-to-b from-[#00af66] to-[#00af66]/65 text-white font-bold text-base py-4 px-6 rounded-xl text-center no-underline shadow-md shadow-emerald-600/10"
                whileHover={{ scale: 1.01, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                Get personalised quotes
              </motion.a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;