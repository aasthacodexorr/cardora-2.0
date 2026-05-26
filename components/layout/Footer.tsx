/* =========================
   Footer Component (Layout)
   Renders the site-wide footer with:
   - Link columns (Popular Makes, Car Types, About Us, Follow Us)
   - Contact / address block
   - Copyright bar with privacy/terms links
========================= */

import { MapPin } from "lucide-react";
import Image from "next/image";
import zlogo from "@/assets/brand/zlogo.png";

/* ── Static Data ────────────────────────────────────────────── */
const columns = [
  {
    title: "Popular Makes",
    links: [
      "Used Toyota", "Used Hyundai", "Used BMW", "Used Honda",
      "Used Mercedes", "Used Ford", "Used Dodge", "Used Volkswagen",
    ],
  },
  {
    title: "Popular Car Types",
    links: [
      "Used SUVs", "Used Vans", "Used Hatchbacks", "Used Sedans",
      "Used Coupes", "Used Convertibles", "Used Pick-up",
    ],
  },
  {
    title: "About Us",
    links: [
      "Home", "Find Your Car", "Sell or Trade In", "Car Finance",
      "Payment Calculator", "Skip the Dealership", "About Us", "Contact Us",
    ],
  },
  {
    title: "Follow Us",
    links: ["Facebook", "Instagram", "TikTok", "YouTube"],
  },
];

/* ── Component ─────────────────────────────────────────────── */
const Footer = () => {
  return (
    <footer className="w-full bg-[#121319] border-t-0 -mt-5 ">
      <div className="mx-auto max-w-[1600px] px-10 pb-5">

        {/* Link columns grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[18px] font-bold tracking-[1px] uppercase mb-5 text-white">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] uppercase text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact / address column */}
          <div>
            <h3 className="text-[18px] font-bold tracking-[1px] uppercase mb-5 text-white">
              Contact Us
            </h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-white/85 shrink-0 mt-0.5" />
              <address className="not-italic text-[15px] leading-relaxed text-white cursor-pointer">
                8050 Dixie Rd,<br />
                Brampton, ON<br />
                L6T 4W6
              </address>
            </div>
          </div>
        </div>

        
      </div>
      <div className="mt-12">
          <hr className="border-dark-border" />
        </div>

        {/* Copyright bar */}
        <div className="pt-6 px-10 pb-5 flex flex-col md:flex-row gap-4 justify-between max-[767px]:justify-center max-[767px]:items-center">
          <p className="text-[13px] text-white uppercase">
            © 2026 Cardora Motor Group. <br />
            <span className="flex items-center gap-2">
              All rights reserved. Powered by
              <a
                href="https://www.zopdealer.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src={zlogo} alt="Zop Dealer" width={20} height={20} />
              </a>
            </span>
          </p>
          <p className="text-[12.5px] text-white uppercase">
            <a href="#" className="hover:text-white">Privacy Policy </a>
            {"|"}
            <a href="#" className="hover:text-white"> Terms &amp; Conditions </a>
            {"|"}
            <a href="#" className="hover:text-white"> Site Map</a>
          </p>
        </div>
    </footer>
  );
};

export default Footer;
