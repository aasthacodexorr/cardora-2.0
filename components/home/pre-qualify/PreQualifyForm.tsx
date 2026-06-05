import { INPUT_CLASS, LABEL_CLASS, LOAN_TERMS, APR_MAP } from "./constants";
import type { PreQualifyFormProps } from "./types";

const PreQualifyForm = ({
  vehiclePrice,
  downPayment,
  loanTerm,
  creditScore,
  includeTradeIn,
  tradeInValue,
  onVehiclePriceChange,
  onDownPaymentChange,
  onLoanTermChange,
  onCreditScoreChange,
  onIncludeTradeInToggle,
  onTradeInValueChange,
}: PreQualifyFormProps) => {
  return (
    <div className="w-full pb-4">
      <h2 className="text-[26px] sm:text-[30px] lg:text-[36px] font-bold text-[#333] leading-tight tracking-tight ">
        Pre-qualify with no impact to your credit
      </h2>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Vehicle Price */}
        <div>
          <label className={LABEL_CLASS}>
            Vehicle Price
          </label>
          <input
            type="number"
            value={vehiclePrice}
            onChange={(e) => onVehiclePriceChange(e.target.value)}
            placeholder="$ 25,000"
            className={INPUT_CLASS}
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className={LABEL_CLASS}>
            Down Payment
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => onDownPaymentChange(e.target.value)}
            placeholder="$ 2,000"
            className={INPUT_CLASS}
            
          />
        </div>

        {/* Loan Term */}
        <div>
          <label className={LABEL_CLASS}>
            Loan Term
          </label>
          <select
            value={loanTerm}
            onChange={(e) => onLoanTermChange(e.target.value)}
            className={INPUT_CLASS}
          >
            {LOAN_TERMS.map((m) => (
              <option key={m} value={m}>{m} Months</option>
            ))}
          </select>
        </div>

        {/* Credit Score → APR */}
        <div>
          <label className={LABEL_CLASS}>
            Interest Rate (Credit Score)
          </label>
          <select
            value={creditScore}
            onChange={(e) => onCreditScoreChange(e.target.value)}
            className={INPUT_CLASS}
          >
            {Object.keys(APR_MAP).map((score) => (
              <option key={score} value={score}>{score}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trade-in toggle */}
      <div
        className="mt-6 sm:mt-8 flex items-center gap-3 cursor-pointer w-fit"
        onClick={onIncludeTradeInToggle}
      >
        <button
          type="button"
          role="switch"
          aria-checked={includeTradeIn}
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
            includeTradeIn ? "bg-gray-200" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 cursor-pointer transform rounded-full transition-transform ${
              includeTradeIn
                ? "translate-x-6 bg-[#1bb776]"
                : "translate-x-1 bg-[#1bb776]"
            }`}
          />
        </button>
        <span className="text-[16px] font-medium text-foreground">Include Trade-In</span>
      </div>

      {/* Trade-in value input (conditional) */}
        
        {
          includeTradeIn ? 
          <div className="mt-6">
          <label className={LABEL_CLASS}>
            Trade-In Value
          </label>
          <input
            type="number"
            value={tradeInValue}
            onChange={(e) => onTradeInValueChange(e.target.value)}
            placeholder="$ 0"
            className={INPUT_CLASS}
          />
          </div>
          : null
        }
        
        </div>
    
  );
};

export default PreQualifyForm;
