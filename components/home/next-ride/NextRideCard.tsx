"use client"; // Required in Next.js App Router for Framer Motion

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { NextRideCardProps } from "./types";

const NextRideCard = ({ image, alt, title, subtitle, to }: NextRideCardProps) => {
  return (
    <Link
      href={to}
      className="group rounded-2xl relative border-2 border-border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow w-full h-full"
    >
      <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Card image container */}
      <div className="aspect-[4/4] overflow-hidden bg-muted relative w-full h-full">
        <motion.div
          // Fixed pixel translation ensures the element boundary does not collapse
          initial={{ y: -120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ 
            type: "spring", 
            stiffness: 55, 
            damping: 14,
            duration: 0.7 
          }}
          className="w-full h-full"
        >
          <Image
            src={image.src}
            alt={alt}
            width={768}
            height={960}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </motion.div>
      </div>

      {/* Card content */}
      <div className="flex items-center justify-between gap-4 px-2 py-5">
        <div className="opacity-70">
          <h3 className="text-[18px] font-bold text-foreground">{title}</h3>
          <p className="text-[16px] mt-1">{subtitle}</p>
        </div>
        <ArrowRight
          className="h-6 w-6 text-brand-green shrink-0 transition-transform group-hover:translate-x-1"
          strokeWidth={2.5}
        />
      </div>
    </Link>
  );
};

export default NextRideCard;