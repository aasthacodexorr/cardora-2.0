import type { PreQualifyResultProps } from "./types";

const PreQualifyResult = ({ biWeeklyPayment, rate, loanAmount }: PreQualifyResultProps) => {
  return (
    <div className="flex flex-col items-center lg:mt-6 min-w-[229px]">
      <div className="w-full rounded-[10px] bg-[#e6f4ff] px-[15px] sm:px-[15px] pt-4 sm:pt-4 pb-[24px] sm:pb-[32px] text-center overflow-hidden border border-blue-100">
        <p className="text-[16px] sm:text-[15px] tracking-wider mb-0 capitalize">
          Est. Bi-Weekly
        </p>
        <div className=" my-1 lg:mt-[5px] text-[55px] sm:text-[50px] font-semibold text-[#333] leading-none text-center font-[Poppins,sans-serif]">
          ${loanAmount > 0 ? biWeeklyPayment.toFixed(2) : "0.00"}
        </div>
        <div className="mt-3 sm:mt-3 inline-block rounded-md bg-[#00AF66] text-white px-4 sm:px-5 py-[4px] text-[16px] sm:text-[15px] font-semibold shadow-sm font-[Poppins,sans-serif]">
          at {rate.toFixed(2)}% APR
        </div>
      </div>

      {/* Pre-qualify link */}
      <a
        href="/financing"
        className="mt-7 sm:mt-[10px] w-full min-w-full block text-center rounded-[10px] sm:rounded-[12px] border border-[#00b066] bg-gradient-to-b from-[#00af66] to-[#00af66]/75 text-white py-[12px] sm:py-[10px] text-[18px] sm:text-[16px] font-medium hover:opacity-90 lg:shadow-md transition-opacity"
      >
        Get pre-qualified
      </a>

      <p className=" my-4 lg:mt-[7px] text-center text-[14px] sm:text-[14px] lg:font-medium mb-0">
        No impact to your credit score
      </p>
    </div>
  );
};

export default PreQualifyResult;
