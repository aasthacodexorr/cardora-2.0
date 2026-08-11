"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import t1 from "@/assets/shop-cars/t1.png"
import t2 from "@/assets/shop-cars/t2.png"
import b1 from "@/assets/shop-cars/b1.png"
import b2 from "@/assets/shop-cars/b2.png"
import m1 from "@/assets/shop-cars/m1.png"
import m2 from "@/assets/shop-cars/m2.png"
import offerImg from "@/assets/cars/offer-bg.png";
import jeepImg from "@/assets/cars/jeep-slide.png";
import decImg from "@/assets/cars/dec-clean.png";
import dollar0Img from "@/assets/cars/dollar-glyph-0.png";
import dollar1Img from "@/assets/cars/dollar-glyph-1.png";
import dollar2Img from "@/assets/cars/dollar-glyph-2.png";


const SHOP_TILES = [
  { src: t1?.src, className: "col-span-6 row-span-1 ml-[10px]" },
  { src: t2?.src, className: "col-span-6 row-span-1 mr-[10px]" },
  { src: m1?.src, className: "col-span-4 row-span-1 rounded-r-[14px] rounded-l-none" },
  { src: m2?.src, className: "col-span-5 row-span-1", imgPosition: "object-[45%_center]" },
  { src: b1?.src, className: "col-span-3 row-span-1 rounded-l-[14px] rounded-r-none" },
  { src: b2?.src, className: "col-span-6 row-span-1 ml-[10px]" },
];

const ROWS = [[0, 1], [2, 3, 4], [5, 6]];
const DIAGONALS = [
  [0, 3, 6],
  [1, 3, 5],
  [0, 2, 5],
  [1, 4, 6],
  [0, 4],
  [1, 2],
  [2, 6],
  [4, 5],
];

export default function OfferCards() {
  const [activeTiles, setActiveTiles] = useState<number[]>([]);

  // Random Tile Focus Logic
  useEffect(() => {
    const pick = (arr: number[], n: number) => {
      const copy = [...arr];
      const out: number[] = [];
      while (out.length < n && copy.length) {
        out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
      }
      return out;
    };

    const nextFocus = () => {
      const mode = Math.random();
      let active: number[];

      if (mode < 0.34) {
        active = ROWS[Math.floor(Math.random() * ROWS.length)];
      } else if (mode < 0.67) {
        active = DIAGONALS[Math.floor(Math.random() * DIAGONALS.length)];
      } else {
        active = pick([0, 1, 2, 3, 4, 5, 6], Math.random() < 0.45 ? 1 : 2);
      }

      setActiveTiles(active);
    };

    nextFocus();
    const interval = setInterval(nextFocus, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center items-center font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch w-full max-w-[1256px]">

        {/* Card 1: Shop all cars */}
        <Link
          href="#"
          className="group w-full min-h-[540px] bg-white rounded-[14px] border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-inherit no-underline"
          aria-label="Shop all cars — a wide selection, updated daily"
        >
          <div className="relative bg-[#d9d9d9] flex-1 min-h-[420px] grid grid-cols-12 grid-rows-3 gap-2 py-2.5 overflow-hidden">
            {SHOP_TILES.map((tile, idx) => {
              const isClear = activeTiles.includes(idx);
              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-[14px] bg-white transition-[filter] duration-450 ease-in-out ${isClear ? "blur-0 z-[2]" : "blur-[2.5px]"
                    } ${tile.className}`}
                >
                  <Image
                    src={tile.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className={`object-cover ${tile.imgPosition || ""}`}
                  />
                </div>
              );
            })}
          </div>

          <Footer title="Shop all cars" subtitle="A wide selection, updated daily" />
        </Link>

        {/* Card 2: Start with a trade-in */}
        <Link
          href="#"
          className="group w-full min-h-[540px] bg-white rounded-[14px] border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-inherit no-underline"
          aria-label="Start with a trade-in — get an offer in under 2 minutes"
        >
          <div className="relative bg-[#e8f6ff] flex-1 min-h-[420px] overflow-hidden">
            <Image
              src={offerImg?.src}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top"
            />

            <Image
              src={jeepImg?.src}
              alt="White Jeep Wrangler Rubicon"
              width={1024}
              height={644}
              className="absolute left-0 right-0 bottom-0 w-full h-[62%] object-contain object-bottom z-[1] will-change-transform animate-jeep-drive"
            />

            {/* Dollar Glyphs */}
            <div className="absolute left-1/2 top-[34%] -translate-x-1/2 flex items-end justify-center min-w-[130px] pointer-events-none z-[2]" aria-hidden="true">
              <Image
                src={dollar1Img?.src}
                alt=""
                width={38}
                height={50}
                className="w-[38px] h-auto drop-shadow-[0_3px_6px_rgba(0,168,45,0.2)] animate-dollar-count"
                style={{ animationDelay: "0s" }}
              />
              <Image
                src={dollar0Img?.src}
                alt=""
                width={40}
                height={50}
                className="w-[40px] h-auto drop-shadow-[0_3px_6px_rgba(0,168,45,0.2)] animate-dollar-count"
                style={{ animationDelay: "0.45s" }}
              />
              <Image
                src={dollar2Img?.src}
                alt=""
                width={38}
                height={50}
                className="w-[38px] h-auto drop-shadow-[0_3px_6px_rgba(0,168,45,0.2)] animate-dollar-count"
                style={{ animationDelay: "0.9s" }}
              />
            </div>
          </div>

          <Footer title="Start with a trade-in" subtitle="Get an offer in under 2 mins." />
        </Link>

        {/* Card 3: Get pre-qualified */}
        <Link
          href="#"
          className="group w-full min-h-[540px] bg-white rounded-[14px] border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-inherit no-underline"
          aria-label="Get pre-qualified — no impact to your credit"
        >
          <div className="relative bg-[#f5f5f5] flex-1 min-h-[420px] overflow-hidden">
            <Image
              src={decImg?.src}
              alt="Get pre-qualified"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center"
            />

            {/* Price Badge Overlay */}
            <div
              className="absolute left-[59%] top-[18%] -translate-x-1/2 w-[68%] h-[17%] flex items-center justify-center gap-[0.06em] bg-[#00ab00] text-white rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.18)] font-bold text-[clamp(1.5rem,6.8vw,2.05rem)] leading-none tracking-tight z-[3] whitespace-nowrap pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <span className="inline-flex items-baseline min-w-[3.2ch] justify-center">
                <span className="inline-block animate-dollar-count" style={{ animationDelay: "0s" }}>$</span>
                <span className="inline-block animate-dollar-count" style={{ animationDelay: "0.45s" }}>$</span>
                <span className="inline-block animate-dollar-count" style={{ animationDelay: "0.9s" }}>$</span>
              </span>
              <span className="ml-[0.2em]">mo.</span>
            </div>
          </div>

          <Footer title="Get pre-qualified" subtitle="No impact to your credit" />
        </Link>

      </div>
    </div>
  );
}

// Sub-component for Card Footers
function Footer({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 bg-white shrink-0 min-h-[84px]">
      <div>
        <h2 className="text-[1.1rem] font-bold text-[#1a1a1a] leading-tight tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-[0.875rem] font-medium text-[#6b7280] leading-snug">
          {subtitle}
        </p>
      </div>
      <span className="shrink-0 w-5.5 h-5.5 text-[#00ab00] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full block">
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
  );
}