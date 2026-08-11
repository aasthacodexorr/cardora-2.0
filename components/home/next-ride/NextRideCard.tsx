import Link from 'next/link';

import t1 from "@/assets/shop-cars/t1.png"
import t2 from "@/assets/shop-cars/t2.png"
import b1 from "@/assets/shop-cars/b1.png"
import b2 from "@/assets/shop-cars/b2.png"
import m1 from "@/assets/shop-cars/m1.png"
import m2 from "@/assets/shop-cars/m2.png"
import m3 from "@/assets/shop-cars/m3.png"
import offerImg from "@/assets/cars/offer-bg.png";
import jeepImg from "@/assets/cars/jeep-slide.png";
import decImg from "@/assets/cars/dec-clean.png";
import dollar0Img from "@/assets/cars/dollar-glyph-0.png";
import dollar1Img from "@/assets/cars/dollar-glyph-1.png";
import dollar2Img from "@/assets/cars/dollar-glyph-2.png";
import sec1 from "@/assets/cars/sec1.png";
import Image from 'next/image';

export default function NextRideCard() {
  return (
    <div className="min-h-screen grid place-items-center font-['DM_Sans',system-ui,sans-serif] ">
      <div className="row grid grid-cols-1 lg:grid-cols-[400px_400px_400px] gap-[28px] items-stretch w-max max-w-full">

        {/* Card 1: Shop all cars */}
        <Link
          href="/inventory"
          className="card w-full min-h-[540px] bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-200 ease text-inherit flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
          aria-label="Shop all cars — a wide selection, updated daily"
        >
          <div
            className="visual shop relative flex-1 min-h-[420px] bg-[#d9d9d9] overflow-hidden"
            aria-hidden="true"
          >
            {sec1 && (
              <img
                src={sec1?.src}
                alt="Shop all cars"
                
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
          className="card w-full min-h-[540px] bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-200 ease text-inherit flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
          aria-label="Start with a trade-in — get an offer in under 2 minutes"
        >
          <div className="visual trade relative flex-1  bg-[#e8f6ff] overflow-hidden">

            <p className="offer-title absolute left-1/2 top-[12%] -translate-x-1/2 m-0 text-[#00a82d] font-bold text-[clamp(1.75rem,7.8vw,2.45rem)] tracking-[-0.03em] leading-none whitespace-nowrap pointer-events-none z-[2]" aria-hidden="true">
              Your offer
            </p>
            <div className="dollars absolute left-1/2 top-[34%] -translate-x-1/2 flex items-end justify-center gap-0 min-w-[130px] pointer-events-none z-[2]" aria-hidden="true">
              <img src={dollar0Img?.src} alt="" width="38" height="48" />
              <img src={dollar1Img?.src} alt="" width="40" height="48" />
              <img src={dollar2Img?.src} alt="" width="38" height="48" />
            </div>
          </div>


          <div>
            <img
              className="offer w-full h-full object-cover object-[center_48%] block"
              src={jeepImg?.src}
              alt="Your offer — white Jeep Wrangler Rubicon"
              width="1024"
              height="1024"
            />
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
          className="card w-full min-h-[540px] bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer transition-all duration-200 ease text-inherit flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
          aria-label="Get pre-qualified — no impact to your credit"
        >
          <div className="visual studio relative flex-1 min-h-[420px] bg-[#f5f5f5] overflow-hidden">
            <img
              className="offer w-full h-full object-cover object-center block"
              src={decImg?.src}
              alt="Get pre-qualified"
              width="1024"
              height="1024"
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