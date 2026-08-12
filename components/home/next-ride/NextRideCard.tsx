import Link from 'next/link';
import Image from 'next/image';

import sec1 from "@/assets/cars/sec1.png";
import jeepImg from "@/assets/cars/jeep-slide.png";
import decImg from "@/assets/cars/dec-clean.png";
import dollar0Img from "@/assets/cars/dollar-glyph-0.png";
import dollar1Img from "@/assets/cars/dollar-glyph-1.png";
import dollar2Img from "@/assets/cars/dollar-glyph-2.png";

export default function NextRideCard() {
  return (
    <div className="w-full flex justify-center font-['DM_Sans',system-ui,sans-serif]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[40px] w-full max-w-[1250px]">

        {/* Card 1: Shop all cars */}
        <Link
          href="/inventory"
          className="card w-full min-h-[480px] sm:min-h-[200px] bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-200 ease text-inherit flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
          aria-label="Shop all cars — a wide selection, updated daily"
        >
          <div
            className="visual shop relative flex-1 min-h-[300px] sm:min-h-[200px] bg-[#d9d9d9] overflow-hidden"
            aria-hidden="true"
          >
            {sec1 && (
              <Image
                src={sec1}
                alt="Shop all cars"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center"
                priority
              />
            )}
          </div>

          <div className="footer flex items-center justify-between gap-4 p-[18px_20px_20px] bg-white shrink-0 min-h-[84px]">
            <div className="footer-copy">
              <h2 className="text-[1.05rem] font-bold text-[#1a1a1a] leading-[1.25] tracking-[-0.01em]">
                Shop all cars
              </h2>
              <p className="mt-[4px] text-[0.875rem] font-medium text-[#6b7280] leading-[1.35]">
                A wide selection, updated daily
              </p>
            </div>

            <span
              className="arrow shrink-0 w-[22px] h-[22px] text-[#00ab00] transition-transform duration-200 ease group-hover:translate-x-[4px]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full block"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>

        {/* Card 2: Trade-in / Jeep card */}
      <Link
  href="/trade-in-my-car"
  className="card w-full min-h-[480px] sm:min-h-[200px] bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-200 ease text-inherit flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
  aria-label="Start with a trade-in — get an offer in under 2 minutes"
>
  <div className="visual trade relative min-h-[300px] sm:min-h-[200px] bg-[#e8f6ff] overflow-hidden flex flex-col items-center justify-center pb-4 pt-6">
    
    {/* Header & Dollar signs section */}
    <div className="text-center z-[2] pointer-events-none flex flex-col items-center">
      <p className="offer-title m-0 text-[#00a82d] font-bold text-[clamp(1.75rem,7.8vw,2.45rem)] tracking-[-0.03em] leading-none whitespace-nowrap" aria-hidden="true">
        Your offer
      </p>
      
      <div className="dollars flex items-center justify-center gap-1 mt-2 min-w-[130px]" aria-hidden="true">
        <Image src={dollar0Img} alt="" width={38} height={48} className="w-[32px] sm:w-[38px] h-auto" />
        <Image src={dollar1Img} alt="" width={40} height={48} className="w-[34px] sm:w-[40px] h-auto" />
        <Image src={dollar2Img} alt="" width={38} height={48} className="w-[32px] sm:w-[38px] h-auto" />
      </div>
    </div>

    {/* Jeep image - changed to object-contain with bottom padding to preserve aspect ratio */}
    <div className="relative w-full h-[180px] sm:h-[220px] mt-auto z-[1]">
      <Image
        className="offer object-contain object-bottom p-2"
        src={jeepImg}
        alt="Your offer — white Jeep Wrangler Rubicon"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>

  </div>

  <div className="footer flex items-center justify-between gap-4 p-[18px_20px_20px] bg-white shrink-0 min-h-[84px]">
    <div className="footer-copy">
      <h2 className="text-[1.05rem] font-bold text-[#1a1a1a] leading-[1.25] tracking-[-0.01em]">Start with a trade-in</h2>
      <p className="mt-[4px] text-[0.875rem] font-medium text-[#6b7280] leading-[1.35]">Get an offer in under 2 mins.</p>
    </div>
    <span className="arrow shrink-0 w-[22px] h-[22px] text-[#00ab00] transition-transform duration-200 ease group-hover:translate-x-[4px]" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </div>
</Link>
        {/* Card 3: Monthly / VW card */}
        <Link
          href="/finance"
          className="card w-full min-h-[480px] sm:min-h-[200px] bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-200 ease text-inherit flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
          aria-label="Get pre-qualified — no impact to your credit"
        >
          <div className="visual studio relative flex-1 min-h-[300px] sm:min-h-[200px] bg-[#f5f5f5] overflow-hidden">
            <Image
              className="offer object-cover object-center"
              src={decImg}
              alt="Get pre-qualified"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="price-badge absolute left-[59%] top-[18%] -translate-x-1/2 w-[68%] h-[17%] flex items-center justify-center gap-[0.06em] p-0 bg-[#00ab00] text-white rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.18)] font-bold text-[clamp(1.5rem,6.8vw,2.05rem)] leading-none tracking-[-0.02em] z-[3] whitespace-nowrap pointer-events-none overflow-hidden" aria-hidden="true">
              <span className="count inline-flex items-baseline min-w-[3.2ch] justify-center">
                <span>$</span>
                <span>$</span>
                <span>$</span>
              </span>
              <span className="mo ml-[0.2em]">mo.</span>
            </div>
          </div>

          <div className="footer flex items-center justify-between gap-4 p-[18px_20px_20px] bg-white shrink-0 min-h-[84px]">
            <div className="footer-copy">
              <h2 className="text-[1.05rem] font-bold text-[#1a1a1a] leading-[1.25] tracking-[-0.01em]">Get pre-qualified</h2>
              <p className="mt-[4px] text-[0.875rem] font-medium text-[#6b7280] leading-[1.35]">No impact to your credit</p>
            </div>
            <span className="arrow shrink-0 w-[22px] h-[22px] text-[#00ab00] transition-transform duration-200 ease group-hover:translate-x-[4px]" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}