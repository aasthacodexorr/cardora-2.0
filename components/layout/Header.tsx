/* =========================
   Header Component (Layout)
   Renders the site-wide navigation header.
   - Desktop: logo, nav links, call-us button
   - Mobile: logo, social icons, action bar (call/directions/menu),
     and a slide-down nav drawer
   Closes mobile menu on route change and locks body scroll
   while the drawer is open.
========================= */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import facebook from "@/assets/social/fb.png";
import instagram from "@/assets/social/insta-1.png";
import famicons from "@/assets/icons/famicons_call.svg";

import CardoraLogo from "@/components/common/CardoraLogo";
import { SITE_CONFIG, NAV_ITEMS, PHONE_NUMBER, PHONE_HREF } from "@/constants";

/*  Component */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isHomePage = pathname === "/";

  return (
    <>
      {/*  Desktop Header */}
      <header className={`hidden lg:block w-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] px-8 ${!isHomePage ? "bg-[#f9f9f9]" : "bg-[#f9f9f9]"}`} >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between py-[7.4px]">

          {/* Logo */}
          <div className="flex-[0.2] [&_img]:w-full [&_img]:object-[initial] [&_img]:h-auto [&_img]:max-w-[165px]">
            <Link href="/" aria-label="Cardora home">
              <CardoraLogo />
            </Link>
          </div>

          {/* Primary Navigation */}
          <nav className="flex-[0.6] flex justify-center items-center gap-0">
            {NAV_ITEMS.map((item, index) => {
              const isActive =
                pathname === item.to || pathname?.startsWith(item.to + "/");
              const isLast = index === NAV_ITEMS.length - 1;
              return (
                <Link
                  key={item.label}
                  href={item.to}
                  onClick={(e) => {
                    if (item.to === "/inventory") {
                      e.preventDefault();
                      // Force a clean page load with no query parameters
                      window.location.href = "/inventory";
                    }
                  }}
                  className={` relative text-[16px] font-bold transition-colors whitespace-nowrap capitalize tracking-[0px] mt-2 py-[6px] px-5 leading-normal font-[Lato,sans-serif] ${
                    !isLast ? "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[22px] after:w-[2px] after:bg-[#b5b4b459]" : ""
                  } ${
                    isActive
                      ? "text-brand-green"
                      : "text-black hover:text-brand-green"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Call-Us Button */}
          <div className="flex-[0.2] flex justify-end pr-5">
            <a
              href={PHONE_HREF}
              className="text-[#00af66] flex items-center gap-[5px] text-[20px] font-semibold"
            >
              <Image src={famicons} alt="Phone" className="w-[22px] h-[22px]" />
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </header>

      {/*  Mobile Header */}
      <header className="lg:hidden w-full bg-[#f9f9f9] shadow-none relative z-50">

        {/* Top bar: logo + social icons */}
        <div className="flex items-center justify-between pl-[12px] pr-[29px] py-[5px]">
          <Link href="/" aria-label="Cardora home" className="[&_img]:max-w-[125px] [&_img]:h-auto">
            <CardoraLogo />
          </Link>

          <div className="flex items-center gap-5">
            <a
              href={SITE_CONFIG.social?.facebook ?? "https://facebook.com"}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Image 
                src={facebook} 
                alt="Facebook" 
                width={23}
                height={23}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            </a>
            <a
              href={SITE_CONFIG.social?.instagram ?? "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Image 
                src={instagram} 
                alt="Instagram" 
                width={23}
                height={23}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            </a>
          </div>
        </div>

        {/* Green action bar: call, directions, menu toggle */}
        <div className="text-white flex items-center justify-between py-2 relative border-t border-[#dadada] border-b border-b-[#dadada]">
          <div className="flex items-center gap-5 px-4 top-0">

            {/* Call */}
            <a
              href={PHONE_HREF}
              className="flex flex-col items-center justify-center gap-1 group text-white bg-[#00af66] rounded-[5px] w-[181px] max-[537px]:w-[150px] max-[480px]:w-[100px] max-[397px]:w-[90px] py-[13px] px-[10px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4 w-4 fill-white text-white">
                <path d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z" />
              </svg>
            </a>

            {/* Directions */}
            <a
              href={"/contact-us"}
              // target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1 group text-white bg-[#00af66] rounded-[5px] w-[181px] max-[537px]:w-[150px] max-[480px]:w-[100px] max-[397px]:w-[90px] py-[13px] px-[10px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-4 w-4 fill-white text-white">
                <path d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z" />
              </svg>
            </a>
          </div>

          <div className="border-r border-[#dadada] min-h-[50px] ml-10">
            <span className="border-r border-[#dadada]"></span>
          </div>

          {/* Menu toggle */}
          <div className="flex items-start w-full justify-center">
            <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center justify-center gap-1 mx-[7%] max-[537px]:mx-[6%] max-[397px]:mx-[4%]"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-[24px] w-[24px] text-black fill-black" />
            ) : (
              <Menu className="h-[24px] w-[24px] text-black fill-black" />
            )}
          </button>
          </div>

          {/* Vertical divider before menu button */}
        </div>

        {/* Slide-down nav drawer */}
        <div
          className={`absolute top-full left-0 w-full bg-white overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-6 py-6 pb-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.to || pathname?.startsWith(item.to + "/");
              return (
                <Link
                  key={item.label}
                  href={item.to}
                  onClick={(e) => {
                    if (item.to === "/inventory") {
                      e.preventDefault();
                      // Force a clean page load with no query parameters
                      window.location.href = "/inventory";
                    }
                  }}
                  className={`py-4 border-b border-gray-100 text-[17px] capitalize flex items-center justify-between ${
                    "text-gray-900"
                  }`}
                >
                  {item.label}
                  {/* <span className={isActive ? "text-brand-green" : "text-gray-300"}>→</span> */}
                </Link>
              );
            })}

            {/* Bottom call-to-action */}
            {/* <div className="mt-8 pt-6">
              <a
                href={PHONE_HREF}
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold text-[16px] shadow-md hover:bg-gray-800 transition-colors"
              >
                <Phone className="h-5 w-5" />
                {PHONE_NUMBER}
              </a>
            </div> */}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
