/* =========================
   Footer Component (Layout)
   Renders the site-wide footer with:
   - Link columns (Popular Makes, Car Types, About Us, Follow Us)
   - Contact / address block
   - Copyright bar with privacy/terms links
========================= */

"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import Image from "next/image";
import zlogo from "@/assets/brand/zlogo.png";
import { POPULAR_MAKES, POPULAR_CAR_TYPES, getMakeUrl, getBodyTypeUrl, getInventoryUrlByRefinement } from "@/lib/inventoryUrls";
import { appConfig } from "@/lib/appConfig";
import { usePathname } from "next/navigation";


/*  Static Data */
const columns = [
  {
    title: "Popular Makes",
    links: POPULAR_MAKES.map(({ label, make }) => ({
      label,
      href: getMakeUrl(make),
      external: false,
    })),
  },
  {
    title: "Popular Car Types",
    links: POPULAR_CAR_TYPES.map(({ label, bodyType }) => ({
      label,
      href: getInventoryUrlByRefinement("body_type", [bodyType]),
      external: false,
    })),
  },
  {
    title: "About Us",
    links: [
      { label: "Home", href: "/", external: false },
      { label: "Find Your Car", href: "/inventory", external: false },
      { label: "Sell or Trade In", href: "/trade-in", external: false },
      { label: "Car Finance", href: "/financing", external: false },
      { label: "Payment Calculator", href: "/payment-calculator", external: false },
      { label: "Skip the Dealership", href: "/skip-the-dealership", external: false },
      { label: "About Us", href: "/about-us", external: false },
      { label: "Contact Us", href: "/contact-us", external: false },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "Facebook", href: appConfig.dealership.social_media_facebook, external: true },
      { label: "Instagram", href: appConfig.dealership.social_media_instagram, external: true },
      { label: "TikTok", href: appConfig.dealership.social_media_tiktok, external: true },
      { label: "YouTube", href: appConfig.dealership.social_media_youtube, external: true },
    ],
  },
];

/*  Component */
const Footer = () => {
  const d = appConfig.dealership;
  const mapsUrl = d.address_map_url_1 || d.address_1_bar;
  const pathname = usePathname();

  return (
    <footer className="w-full bg-[#121319] border-t-0 -mt-5 ">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10 pb-5">

        {/* Link columns grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[18px] font-bold tracking-[1px] uppercase mb-5 text-white">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] uppercase text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[15px] uppercase text-white transition-colors"
                        onClick={(e) => {
                          if (
                            pathname === "/inventory" &&
                            link.href.startsWith("/inventory")
                          ) {
                            e.preventDefault();
                            window.location.href = link.href;
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
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
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <address className="not-italic text-[15px] leading-relaxed text-white cursor-pointer">
                  {d.full_address_1},<br />
                  {d.city_1}, {d.province_1}<br />
                  {d.postal_code_1} {d.country_1}
                </address>
              </a>
            </div>
          </div>
        </div>


      </div>
      <div className="mt-12">
        <hr className="border-dark-border" />
      </div>

      {/* Copyright bar */}
      <div className="pt-6 px-10 pb-5 flex flex-col md:flex-row gap-4 justify-between max-[767px]:justify-center max-[767px]:items-center">
        <p className="text-[13px] text-white uppercase text-center md:text-start">
          © {new Date().getFullYear()} {d.dealership_name}. <br />
          <span className="flex items-center gap-2">
            All rights reserved. Powered by
            <a
              href="https://www.zopdealer.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image 
                src={zlogo} 
                alt="Zop Dealer" 
                width={20} 
                height={20}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            </a>
          </span>
        </p>
        <p className="text-[12.5px] text-white uppercase">
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          {" | "}
          <Link href="/terms-and-conditions" className="hover:text-white">Terms &amp; Conditions</Link>
          {" | "}
          <Link href="/sitemap" className="hover:text-white">Site Map</Link>
        </p>
      </div>
    </footer>
  );
};
  
export default Footer;
