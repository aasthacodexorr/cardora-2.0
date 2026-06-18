import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { NextRideCardProps } from "./types";

const NextRideCard = ({ image, alt, title, subtitle, to }: NextRideCardProps) => {
  return (
    <Link
      href={to}
      className="group rounded-2xl relative border-2 border-border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow w-full h-full"
    >
      <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Card image */}
      <div className="aspect-[4/4] overflow-hidden bg-muted ">
        {/* Overlay */}
        <Image
          src={image.src}
          alt={alt}
          width={768}
          height={960}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      {/* Card content */}
      <div className="flex items-center justify-between gap-4 px-2 py-5">
        <div className="opacity-70">
          <h3 className="text-[18px] font-bold text-foreground">{title}</h3>
          <p className="text-[16px] mt-1">{subtitle}</p>
        </div>
        <ArrowRight
          className="h-6 w-6 text-brand-green shrink-0 transition-transform"
          strokeWidth={2.5}
        />
      </div>
    </Link>
  );
};

export default NextRideCard;
