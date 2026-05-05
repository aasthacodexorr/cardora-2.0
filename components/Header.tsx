"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Menu, X } from "lucide-react";
import Image from "next/image";
import facebook from "../assets/fb.png";
import instagram from "../assets/insta-1.png";
import famicons from "../assets/famicons_call.svg"

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
);
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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Set initial value
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isLandingPage = pathname === "/";
  const headerBgClass =
    isLandingPage && !isScrolled
      ? "bg-transparent"
      : "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]";
  const mobileHeaderBgClass =
    isLandingPage && !isScrolled ? "bg-transparent" : "bg-white shadow-sm";
  const topBarBgClass =
    isLandingPage && !isScrolled ? "bg-transparent" : "bg-white";

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`hidden lg:block w-full sticky top-0 z-50 global_header transition-colors duration-300 ${headerBgClass}`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between  py-4">
          <div className="flex-[0.2] main_logo">
            <Link href="/" aria-label="Cardora home">
              <CardoraLogo />
            </Link>
          </div>

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

          <div className="flex-[0.2] flex justify-end callus_btn_header">
            <a
              href="tel:1-855-514-5500"
              className=""
            >
              {/* <Phone className="h-4 w-4" /> */}
              <Image src={famicons} alt="Phone" className="h-4 w-4" />
              1-855-514-5500
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`lg:hidden w-full sticky top-0 z-50 flex flex-col transition-colors duration-300 ${mobileHeaderBgClass}`}
      >
        {/* Top Bar */}
        <div
          className={`flex items-center justify-between px-4 py-3 z-50 transition-colors duration-300 ${topBarBgClass}`}
        >
          <Link
            href="/"
            aria-label="Cardora home"
            className="relative z-50 cardora_mobile_logo"
          >
            <CardoraLogo />
          </Link>
          <div className="flex items-center gap-5 relative z-50">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-gray-600 hover:text-brand-green"
            >
              {/* <FacebookIcon className="h-[22px] w-[22px]" /> */}
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
              className="text-gray-600 hover:text-brand-green"
            >
              {/* <InstagramIcon className="h-[22px] w-[22px]" /> */}
              <Image
                src={instagram}
                alt="Instagram"
                className="mobile_iocns_header"
              />
            </a>
          </div>
        </div>

        {/* Action Bar (Green) */}
        <div className="bg-brand-green text-white flex items-center justify-between px-6 py-2.5 z-50 shadow-md">
          <div className="flex items-center gap-8">
            <a
              href="tel:1-855-514-5500"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <Phone className="h-[22px] w-[22px] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Call Us
              </span>
            </a>
            <a
              href={SITE_CONFIG.urls.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <MapPin className="h-[22px] w-[22px] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Directions
              </span>
            </a>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center justify-center gap-1 relative z-50 group"
          >
            {isMobileMenuOpen ? (
              <X className="h-[24px] w-[24px] group-hover:scale-110 transition-transform" />
            ) : (
              <Menu className="h-[24px] w-[24px] group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isMobileMenuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>

        {/* Mobile Navigation Menu Overlay */}
        <div
          className={`fixed inset-0 top-[116px] bg-white z-40 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
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
