"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Menu, X } from "lucide-react";
import Image from "next/image";

import facebook from "../assets/fb.png";
import instagram from "../assets/insta-1.png";
import famicons from "../assets/famicons_call.svg";

import CardoraLogo from "./CardoraLogo";
import { SITE_CONFIG } from "@/lib/config";

const navItems = [
  { label: "Shop", to: "/inventory" },
  { label: "Sell/Trade", to: "/trade-in" },
  { label: "Finance", to: "/financing" },
  { label: "Protection Plans", to: "/protection-plans" },
  { label: "Service", to: "/service" },
  { label: "Why Cardora?", to: "/about-us" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block w-full bg-white global_header shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-[0.2] main_logo">
            <Link href="/" aria-label="Cardora home">
              <CardoraLogo />
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-[0.6] flex justify-center items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.to || pathname?.startsWith(item.to + "/");

              return (
                <Link
                  key={item.label}
                  href={item.to}
                  className={`text-[15px] font-bold transition-colors whitespace-nowrap uppercase tracking-wide ${
                    isActive
                      ? "text-brand-green"
                      : "text-gray-800 hover:text-brand-green"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Call Button */}
          <div className="flex-[0.2] flex justify-end callus_btn_header">
            <a href="tel:1-855-514-5500">
              <Image src={famicons} alt="Phone" className="h-4 w-4" />
              1-855-514-5500
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden w-full bg-white shadow-sm relative z-50">
        {/* Top */}
        <div className="flex items-center justify-between px-4 py-3 mb_h">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Cardora home"
            className="cardora_mobile_logo"
          >
            <CardoraLogo />
          </Link>

          {/* Social */}
          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Image
                src={facebook}
                alt="Facebook"
                className="mobile_iocns_header"
              />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Image
                src={instagram}
                alt="Instagram"
                className="mobile_iocns_header"
              />
            </a>
          </div>
        </div>

        {/* Green Action Bar */}
        <div className="bg-brand-green text-white flex items-center justify-between px-6 py-2.5 shadow-md  mobile_icons_nav_wr">
          <div className="flex items-center gap-8 mobile_icons_nav">
            {/* Call */}
            <a
              href="tel:1-855-514-5500"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              {/* <Phone className="h-[22px] w-[22px]" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Call Us
              </span>
            </a>

            {/* Directions */}
            <a
              href={SITE_CONFIG.urls.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              {/* <MapPin className="h-[22px] w-[22px]" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Directions
              </span>
            </a>
          </div>

          {/* Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center justify-center gap-1"
          >
            {isMobileMenuOpen ? (
              <X className="h-[24px] w-[24px]" />
            ) : (
              <Menu className="h-[24px] w-[24px]" />
            )}

            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isMobileMenuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}

        <div
          className={`absolute top-full left-0 w-full bg-white overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-6 py-6 pb-24">
            {navItems.map((item) => {
              const isActive =
                pathname === item.to || pathname?.startsWith(item.to + "/");

              return (
                <Link
                  key={item.label}
                  href={item.to}
                  className={`py-4 border-b border-gray-100 text-[18px] font-extrabold uppercase tracking-wide flex items-center justify-between ${
                    isActive ? "text-brand-green" : "text-gray-900"
                  }`}
                >
                  {item.label}

                  <span
                    className={isActive ? "text-brand-green" : "text-gray-300"}
                  >
                    →
                  </span>
                </Link>
              );
            })}

            {/* Bottom Call Button */}
            <div className="mt-8 pt-6">
              <a
                href="tel:1-855-514-5500"
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold text-[16px] shadow-md hover:bg-gray-800 transition-colors"
              >
                <Phone className="h-5 w-5" />
                1-855-514-5500
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
