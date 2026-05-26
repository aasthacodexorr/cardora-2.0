/* =========================
   PreQualify Component (Home)
   Interactive bi-weekly payment calculator.
   Inputs: vehicle price, down payment, loan term,
   credit score (maps to APR), optional trade-in value.
   Calculates estimated bi-weekly payment in real time
   using standard amortization formula.
   Links to /financing for the full pre-qualification flow.
========================= */

"use client";

import { useState } from "react";
import PreQualifyForm from "./PreQualifyForm";
import PreQualifyResult from "./PreQualifyResult";
import { APR_MAP, CARD_CLASS, CONTAINER_CLASS, GRID_CLASS } from "./constants";

const PreQualify = () => {
  const [vehiclePrice,    setVehiclePrice]    = useState("25000");
  const [downPayment,     setDownPayment]     = useState("0");
  const [loanTerm,        setLoanTerm]        = useState("96");
  const [creditScore,     setCreditScore]     = useState("Good");
  const [includeTradeIn,  setIncludeTradeIn]  = useState(false);
  const [tradeInValue,    setTradeInValue]    = useState("0");

  // Derived values
  const rate        = APR_MAP[creditScore] ?? 7.99;
  const price       = parseFloat(vehiclePrice) || 0;
  const down        = parseFloat(downPayment)  || 0;
  const tradeIn     = includeTradeIn ? (parseFloat(tradeInValue) || 0) : 0;
  const loanAmount  = price - down - tradeIn;

  // Bi-weekly amortization: 26 periods per year
  const termPeriods = (parseInt(loanTerm) || 0) / 12 * 26;
  const periodRate  = (rate / 100) / 26;

  let biWeeklyPayment = 0;
  if (loanAmount > 0 && periodRate > 0) {
    biWeeklyPayment =
      (loanAmount * periodRate * Math.pow(1 + periodRate, termPeriods)) /
      (Math.pow(1 + periodRate, termPeriods) - 1);
  }

  return (
    <section className="w-full bg-background">
      <div className={CONTAINER_CLASS}>
        <div className={CARD_CLASS}>
          <div className={GRID_CLASS}>

            <PreQualifyForm
              vehiclePrice={vehiclePrice}
              downPayment={downPayment}
              loanTerm={loanTerm}
              creditScore={creditScore}
              includeTradeIn={includeTradeIn}
              tradeInValue={tradeInValue}
              onVehiclePriceChange={setVehiclePrice}
              onDownPaymentChange={setDownPayment}
              onLoanTermChange={setLoanTerm}
              onCreditScoreChange={setCreditScore}
              onIncludeTradeInToggle={() => setIncludeTradeIn(!includeTradeIn)}
              onTradeInValueChange={setTradeInValue}
            />

            <PreQualifyResult
              biWeeklyPayment={biWeeklyPayment}
              rate={rate}
              loanAmount={loanAmount}
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default PreQualify;
