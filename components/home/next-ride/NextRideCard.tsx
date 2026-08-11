import Link from 'next/link';
import Image from 'next/image';

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


export default function NextRideCard() {
  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-stretch justify-center gap-7 lg:grid-cols-3">
      {/* Card 1: Shop all cars */}
      <Link
        href="/shop"
        className="group flex min-h-[540px] w-full flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white text-inherit no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Shop all cars — a wide selection, updated daily"
      >
        <div
          className="relative min-h-[420px] flex-auto overflow-hidden bg-[#d9d9d9] p-[10px_0] [display:grid] [grid-template-columns:repeat(12,1fr)] [grid-template-rows:repeat(3,1fr)] gap-2"
          aria-hidden="true"
        >
          {/* Grid Tile 1 */}
          <div className="ml-[10px] overflow-hidden rounded-[14px] bg-white [grid-column:1/7] [grid-row:1]">
            <Image src={t1?.src}  alt="" width={200} height={150} className="h-full w-full object-cover" />
          </div>
          {/* Grid Tile 2 */}
          <div className="mr-[10px] overflow-hidden rounded-[14px] bg-white [grid-column:7/13] [grid-row:1]">
            <Image src={t2?.src} alt="" width={200} height={150} className="h-full w-full object-cover" />
          </div>
          {/* Grid Tile 3 */}
          <div className="overflow-hidden rounded-r-[14px] bg-white [grid-column:1/5] [grid-row:2]">
            <Image src={m1?.src} alt="" width={150} height={150} className="h-full w-full object-cover" />
          </div>
          {/* Grid Tile 4 */}
          <div className="overflow-hidden rounded-[14px] bg-white [grid-column:5/10] [grid-row:2]">
            <Image src={m2?.src} alt="" width={200} height={150} className="h-full w-full object-cover [object-position:45%_center]" />
          </div>
          {/* Grid Tile 5 */}
          <div className="overflow-hidden rounded-l-[14px] bg-white [grid-column:10/13] [grid-row:2]">
            <Image src={m3?.src} alt="" width={150} height={150} className="h-full w-full object-cover" />
          </div>
          {/* Grid Tile 6 */}
          <div className="ml-[10px] overflow-hidden rounded-[14px] bg-white [grid-column:1/7] [grid-row:3]">
            <Image src={b1?.src} alt="" width={200} height={150} className="h-full w-full object-cover" />
          </div>
          {/* Grid Tile 7 */}
          <div className="mr-[10px] overflow-hidden rounded-[14px] bg-white [grid-column:7/13] [grid-row:3]">
            <Image src={b2?.src} alt="" width={200} height={150} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="flex min-h-[84px] shrink-0 items-center justify-between gap-4 bg-white p-[18px_20px_20px]">
          <div>
            <h2 className="text-[1.05rem] font-bold leading-snug tracking-tight text-[#1a1a1a]">Shop all cars</h2>
            <p className="mt-1 text-sm font-medium leading-tight text-[#6b7280]">A wide selection, updated daily</p>
          </div>
          <span className="h-[22px] w-[22px] shrink-0 text-[#00ab00] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Card 2: Trade-in / Jeep card */}
      <Link
  href="/trade-in-my-car"
  className="group flex min-h-[540px] w-full flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white text-inherit no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
  aria-label="Start with a trade-in — get an offer in under 2 minutes"
>
  {/* Visual Container */}
  <div className="relative flex min-h-[420px] flex-auto flex-col justify-betwee overflow-hidden bg-[#e8f6ff] p-6 pb-0">
    
    {/* Text & Animations Header */}
    <div className="z-10 flex flex-col items-center pt-4 text-center">
      <p className="select-none text-[2.2rem] font-bold leading-none tracking-tight text-[#00ab00]">
        Your offer
      </p>

      {/* Dollar Glyphs Container */}
      <div className="mt-6 flex min-h-[50px]  items-end justify-center gap-1">
        <Image
          src={dollar0Img?.src || dollar0Img}
          alt=""
          width={38}
          height={50}
          className="animate-dollar-drop drop-shadow-[0_3px_6px_rgba(0,168,45,0.2)] [animation-delay:0s]"
        />
        <Image
          src={dollar1Img?.src || dollar1Img}
          alt=""
          width={40}
          height={50}
          className="w-[40px] animate-dollar-drop drop-shadow-[0_3px_6px_rgba(0,168,45,0.2)] [animation-delay:0.2s]"
        />
        <Image
          src={dollar2Img?.src || dollar2Img}
          alt=""
          width={38}
          height={50}
          className="animate-dollar-drop drop-shadow-[0_3px_6px_rgba(0,168,45,0.2)] [animation-delay:0.4s]"
        />
      </div>
    </div>

    {/* Bottom Jeep Image Container */}
    <div className="relative h-full w-full">
      <Image
        src={jeepImg?.src}
        alt="Your offer — white Jeep Wrangler Rubicon"
        fill
        priority
        className="w-full"
      />
    </div>
  </div>

  {/* Card Footer */}
  <div className="flex min-h-[84px] shrink-0 items-center justify-between gap-4 bg-white p-[18px_20px_20px]">
    <div>
      <h2 className="text-[1.05rem] font-bold leading-snug tracking-tight text-[#1a1a1a]">
        Start with a trade-in
      </h2>
      <p className="mt-1 text-sm font-medium leading-tight text-[#6b7280]">
        Get an offer in under 2 mins.
      </p>
    </div>
    <span
      className="h-[22px] w-[22px] shrink-0 text-[#00ab00] transition-transform duration-200 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
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

      {/* Card 3: Monthly / VW card */}
      <Link
        href="/pre-qualify"
        className="group flex min-h-[540px] w-full flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white text-inherit no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Get pre-qualified — no impact to your credit"
      >
        <div className="relative min-h-[420px] flex-auto overflow-hidden bg-[#f5f5f5]">
          <Image
            src={decImg?.src}
            alt="Get pre-qualified"
            width={1024}
            height={1024}
            priority
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute left-[59%] top-[18%] z-20 flex h-[17%] w-[68%] -translate-x-1/2 items-center justify-center gap-[0.06em] overflow-hidden rounded-full bg-[#00ab00] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] text-[clamp(1.5rem,6.8vw,2.05rem)] font-bold leading-none tracking-tight whitespace-nowrap" aria-hidden="true">
            <span className="inline-flex min-w-[3.2ch] justify-center items-baseline">
              <span className="inline-block animate-dollar-count [animation-delay:0s]">$</span>
              <span className="inline-block animate-dollar-count [animation-delay:0.45s]">$</span>
              <span className="inline-block animate-dollar-count [animation-delay:0.9s]">$</span>
            </span>
            <span className="ml-[0.2em]">mo.</span>
          </div>
        </div>

        <div className="flex min-h-[84px] shrink-0 items-center justify-between gap-4 bg-white p-[18px_20px_20px]">
          <div>
            <h2 className="text-[1.05rem] font-bold leading-snug tracking-tight text-[#1a1a1a]">Get pre-qualified</h2>
            <p className="mt-1 text-sm font-medium leading-tight text-[#6b7280]">No impact to your credit</p>
          </div>
          <span className="h-[22px] w-[22px] shrink-0 text-[#00ab00] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </div>
  );
}