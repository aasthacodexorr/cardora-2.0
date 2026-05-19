"use client";

import { useState } from "react";

const PreQualify = () => {
  const [vehiclePrice, setVehiclePrice] = useState("25000");
  const [downPayment, setDownPayment] = useState("0");
  const [loanTerm, setLoanTerm] = useState("96");
  const [creditScore, setCreditScore] = useState("Good");
  const [includeTradeIn, setIncludeTradeIn] = useState(false);
  const [tradeInValue, setTradeInValue] = useState("0");

  // APR mapping by credit score
  const aprMap: Record<string, number> = {
    Excellent: 6.49,
    Good: 7.99,
    Fair: 9.99,
    Poor: 14.99,
  };
  const rate = aprMap[creditScore] ?? 7.99;

  const price = parseFloat(vehiclePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const tradeIn = includeTradeIn ? (parseFloat(tradeInValue) || 0) : 0;

  const termPeriods = (parseInt(loanTerm) || 0) / 12 * 26;
  const rateDecimal = rate / 100;
  const periodRate = rateDecimal / 26;

  const loanAmount = price - down - tradeIn;

  let biWeeklyPayment = 0;
  if (loanAmount > 0 && rateDecimal > 0) {
    biWeeklyPayment =
      (loanAmount * periodRate * Math.pow(1 + periodRate, termPeriods)) /
      (Math.pow(1 + periodRate, termPeriods) - 1);
  }

  return (
    <section className="w-full bg-background">
      {/* container_box: max-w-[1280px] mx-auto px-[15px] */}
      <div className="max-w-[1280px] mx-auto px-[15px]">
        {/* box_card: rounded-[15px] overflow-hidden border border-black/10 p-[30px] */}
        <div className="rounded-[15px] overflow-hidden border border-black/10 p-[30px]">
          {/* grid override from .box_card .grid: 1fr 229px */}
          <div className="grid gap-8 lg:gap-6" style={{ gridTemplateColumns: "1fr 229px" }}>
            {/* Left: form */}
            <div>
              <h2 className="text-[32px] lg:text-[38px] font-extrabold text-[#333] leading-tight tracking-tight">
                Pre-qualify with no impact to your credit
              </h2>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[15px] font-medium text-foreground/80 mb-2">
                    Vehicle Price
                  </label>
                  <input
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    placeholder="$ 25,000"
                    className="w-full rounded-[8px] border border-[#c4c4c4] bg-transparent px-[10px] py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-medium text-foreground/80 mb-2">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="$ 2,000"
                    className="w-full rounded-[8px] border border-[#c4c4c4] bg-transparent px-[10px] py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-medium text-foreground/80 mb-2">
                    Loan Term
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full rounded-[8px] border border-[#c4c4c4] bg-transparent px-[10px] py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  >
                    <option value="96">96 Months</option>
                    <option value="84">84 Months</option>
                    <option value="72">72 Months</option>
                    <option value="60">60 Months</option>
                    <option value="48">48 Months</option>
                    <option value="36">36 Months</option>
                    <option value="24">24 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[15px] font-medium text-foreground/80 mb-2">
                    Interest Rate (Credit Score)
                  </label>
                  <select
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    className="w-full rounded-[8px] border border-[#c4c4c4] bg-transparent px-[10px] py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
              </div>

              {/* Trade-in toggle */}
              <div
                className="mt-8 flex items-center gap-3 cursor-pointer w-fit"
                onClick={() => setIncludeTradeIn(!includeTradeIn)}
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeTradeIn}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    includeTradeIn ? "bg-[#01a960]" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full transition-transform ${
                      includeTradeIn
                        ? "translate-x-6 bg-background"
                        : "translate-x-1 bg-[#1bb776]"
                    }`}
                  />
                </button>
                <span className="text-[16px] font-bold text-foreground">
                  Include Trade-In
                </span>
              </div>

              {/* Trade-in Value Input */}
              {includeTradeIn && (
                <div className="mt-6">
                  <label className="block text-[15px] font-medium text-foreground/80 mb-2">
                    Trade-In Value
                  </label>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(e.target.value)}
                    placeholder="$ 0"
                    className="w-full rounded-[8px] border border-[#c4c4c4] bg-transparent px-[10px] py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  />
                </div>
              )}
            </div>

            {/* Right: result panel */}
            <div className="flex flex-col items-center md:items-stretch mt-8 md:mt-0">
              {/* Result card */}
              <div className="w-full mt-[15px] rounded-[10px] bg-[#e6f4ff] px-[10px] pt-5 pb-[30px] text-center overflow-hidden border border-blue-100">
                <p className="text-[16px] font-medium text-gray-800 tracking-wide mb-0 capitalize">
                  Est. Bi-Weekly
                </p>
                <div className="mt-[5px] text-[50px] font-semibold text-[#333] leading-none tracking-tight text-center font-[Poppins,sans-serif]">
                  ${loanAmount > 0 ? biWeeklyPayment.toFixed(2) : "0.00"}
                </div>
                <div className="mt-4 inline-block rounded-md bg-[#00AF66] text-white px-4 py-1.5 text-[15px] font-semibold shadow-sm font-[Poppins,sans-serif]">
                  at {rate.toFixed(2)}% APR
                </div>
              </div>

              {/* CTA button */}
              <a
                href="/financing"
                className="mt-[10px] w-full min-w-full block text-center rounded-[12px] border border-[#00b066] bg-gradient-to-b from-[#00af66] to-[#00af66]/65 text-white py-[10px] text-[16px] font-medium hover:opacity-90 shadow-md transition-opacity"
              >
                Get pre-qualified
              </a>

              {/* Disclaimer */}
              <p className="mt-[7px] text-center text-[14px] font-medium text-[#333] mb-0 capitalize">
                No impact to your credit score
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreQualify;
