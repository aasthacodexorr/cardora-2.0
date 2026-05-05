import { useState } from "react";

const PreQualify = () => {
  const [vehiclePrice, setVehiclePrice] = useState("25000");
  const [downPayment, setDownPayment] = useState("0");
  const [loanTerm, setLoanTerm] = useState("96");
  const [creditScore, setCreditScore] = useState("Good");
  const [includeTradeIn, setIncludeTradeIn] = useState(false);
  const [tradeInValue, setTradeInValue] = useState("0");

  // APR mapping by credit score matching user snippet
  const aprMap: Record<string, number> = {
    Excellent: 6.49,
    Good: 7.99,
    Fair: 9.99,
    Poor: 14.99,
  };
  const rate = aprMap[creditScore] ?? 7.99;

  // Exact math from the user's snippet
  const price = parseFloat(vehiclePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const tradeIn = includeTradeIn ? (parseFloat(tradeInValue) || 0) : 0;
  
  const termPeriods = (parseInt(loanTerm) || 0) / 12 * 26; // total bi-weekly periods
  const rateDecimal = rate / 100;
  const periodRate = rateDecimal / 26; // bi-weekly interest rate

  const loanAmount = price - down - tradeIn;

  let biWeeklyPayment = 0;
  if (loanAmount > 0 && rateDecimal > 0) {
    biWeeklyPayment =
      (loanAmount * periodRate * Math.pow(1 + periodRate, termPeriods)) /
      (Math.pow(1 + periodRate, termPeriods) - 1);
  }

  return (
    <section className="w-full bg-background impact_section">
      <div className="container_box">
        <div className="box_card">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] gap-8 lg:gap-10">
            {/* Left: form */}
            <div>
              <h2 className="text-[32px] lg:text-[38px] font-extrabold text-foreground leading-tight tracking-tight">
                Pre-qualify with no impact to your credit
              </h2>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[15px] font-bold text-foreground/80 mb-2">
                    Vehicle Price
                  </label>
                  <input
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    placeholder="$ 25,000"
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-foreground/80 mb-2">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="$ 2,000"
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-foreground/80 mb-2">
                    Loan Term
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
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
                  <label className="block text-[15px] font-bold text-foreground/80 mb-2">
                    Interest Rate (Credit Score)
                  </label>
                  <select
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
              </div>

              {/* Trade-in toggle */}
              <div className="mt-8 flex items-center gap-3 cursor-pointer w-fit" onClick={() => setIncludeTradeIn(!includeTradeIn)}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeTradeIn}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    includeTradeIn ? "bg-brand-green" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                      includeTradeIn ? "translate-x-6" : "translate-x-1"
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
                  <label className="block text-[15px] font-bold text-foreground/80 mb-2">
                    Trade-In Value
                  </label>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(e.target.value)}
                    placeholder="$ 0"
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-[16px] text-foreground outline-none focus:border-brand-green"
                  />
                </div>
              )}
            </div>

            {/* Right: result */}
            <div className="flex flex-col items-center md:items-stretch mt-8 md:mt-0 impact_right_sec">
              <div className="w-full rounded-xl bg-[#E6F4FF] px-6 py-8 text-center shadow-inner border border-blue-100">
                <p className="text-[16px] font-bold text-gray-800 uppercase tracking-wide">Est. Bi-Weekly</p>
                <div className="mt-3 text-[48px] lg:text-[56px] font-extrabold text-gray-900 leading-none tracking-tight">
                  ${loanAmount > 0 ? biWeeklyPayment.toFixed(2) : "0.00"}
                </div>
                <div className="mt-4 inline-block rounded-md bg-[#00AF66] text-white px-4 py-1.5 text-[15px] font-bold shadow-sm">
                  at {rate.toFixed(2)}% APR
                </div>
              </div>

              <a href="/financing" className="mt-6 w-full text-center rounded-lg bg-gradient-to-b from-[#00AF66] to-[#00AF66]/80 text-white py-4 text-[18px] font-bold hover:opacity-90 shadow-md transition-opacity">
                Get pre-qualified
              </a>
              <p className="mt-4 text-center text-[14px] font-medium text-gray-500">
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
