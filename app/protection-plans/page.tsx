/* =========================
   Protection Plans Page
   Showcases Cardora's vehicle protection offerings.
   Sections:
   - "Every Vehicle Includes" feature grid
   - "We stand behind our cars" checklist + image
   - "How Cardora keeps you covered" systems grid
   - "What's included?" feature cards
   - GAP Coverage explanation with example scenarios
   - "The Cardora difference" numbered cards
   - DreamVehicleCTA → GetInTouch → Footer
========================= */

"use client";

import {
  Check,
  Car, Truck, Wallet, MapPin, KeyRound,
} from "lucide-react";
import { motion,Variants } from "framer-motion";

// Layout
import { Header, Footer } from "@/components/layout";

// Shared components
import { GetInTouch } from "@/components/common";

// Assets
import rotateCar from "@/assets/cars/rotate-car.png";
import greenCar from "@/assets/cars/green-car.png";
import { CardoraDifference } from "@/components/home";
import Image from "next/image";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

/* Static Data */
const includes = [
  { label: "6-month warranty" },
  { label: "150-point inspection" },
  { label: "Roadside assistance" },
  { label: "10-day exchange" },
];

const standBehind = [
  "Detailed CarFax history report",
  "No flood or frame damage",
  "No salvage history",
  "No odometer problems",
  "Triple stage detailing",
];

const coveredSystems = [
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M21.9996 2.29004C21.6096 2.29004 21.2896 2.61004 21.2896 3.00004V3.29004H8.05961C7.09961 3.29004 6.19961 3.81004 5.70961 4.64004L1.95961 11.14C1.47961 11.98 1.47961 13.01 1.95961 13.85L5.70961 20.35C6.18961 21.19 7.08961 21.7 8.05961 21.7H15.5696C16.5296 21.7 17.4296 21.18 17.9196 20.35L21.6696 13.85C22.1496 13.01 22.1496 11.98 21.6696 11.14L20.2596 8.70004H21.2896V8.99004C21.2896 9.38004 21.6096 9.70004 21.9996 9.70004C22.3896 9.70004 22.7096 9.38004 22.7096 8.99004V3.00004C22.7096 2.61004 22.3896 2.29004 21.9996 2.29004ZM11.9996 8.71004C14.3696 8.71004 16.2896 10.63 16.2896 13C16.2896 15.37 14.3696 17.29 11.9996 17.29C9.62961 17.29 7.70961 15.37 7.70961 13C7.70961 10.63 9.62961 8.71004 11.9996 8.71004ZM8.05961 20.29C7.91961 20.29 7.78961 20.26 7.65961 20.22C7.67961 20.15 7.69961 20.08 7.69961 20V16.76C8.74961 17.95 10.2796 18.71 11.9896 18.71C13.6996 18.71 15.2296 17.95 16.2796 16.76V20C16.2796 20 16.2796 20.03 16.2896 20.05C16.0796 20.2 15.8196 20.29 15.5596 20.29H8.04961H8.05961ZM20.4396 11.85C20.6696 12.25 20.6696 12.74 20.4396 13.14L17.7096 17.86V12.99C17.7096 11.28 16.9496 9.75004 15.7596 8.70004H18.6296L20.4496 11.85H20.4396ZM11.9996 7.29004C8.84961 7.29004 6.28961 9.85004 6.28961 13V18.51L3.18961 13.14C2.95961 12.74 2.95961 12.25 3.18961 11.85L6.93961 5.35004C7.16961 4.95004 7.59961 4.70004 8.05961 4.70004H21.2896V7.28004H11.9996V7.29004Z" fill="currentColor" />
        <path d="M11.9996 15.71C13.4896 15.71 14.7096 14.49 14.7096 13C14.7096 11.51 13.4896 10.29 11.9996 10.29C10.5096 10.29 9.28961 11.51 9.28961 13C9.28961 14.49 10.5096 15.71 11.9996 15.71ZM11.9996 11.71C12.7096 11.71 13.2896 12.29 13.2896 13C13.2896 13.71 12.7096 14.29 11.9996 14.29C11.2896 14.29 10.7096 13.71 10.7096 13C10.7096 12.29 11.2896 11.71 11.9996 11.71Z" fill="currentColor" />
      </svg>
    ),
    label: "Engine",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M1.29004 12C1.29004 6.09004 6.09004 1.29004 12 1.29004C17.91 1.29004 22.71 6.09004 22.71 12C22.71 17.91 17.91 22.71 12 22.71C6.09004 22.71 1.29004 17.91 1.29004 12ZM2.71004 12C2.71004 17.12 6.88004 21.29 12 21.29C17.12 21.29 21.29 17.12 21.29 12C21.29 6.88004 17.12 2.71004 12 2.71004C6.88004 2.71004 2.71004 6.88004 2.71004 12ZM14.5 8.50023C14.5 7.67023 15.17 7.00023 16 7.00023V6.99023C16.83 6.99023 17.5 7.66023 17.5 8.49023C17.5 9.06023 17.18 9.55023 16.71 9.80023V10.9902C16.71 11.9302 15.94 12.7002 15 12.7002H12.71V14.1802C13.18 14.4302 13.5 14.9202 13.5 15.4902C13.5 16.3202 12.83 16.9902 12 16.9902C11.17 16.9902 10.5 16.3202 10.5 15.4902C10.5 14.9202 10.82 14.4302 11.29 14.1802V12.7002H8.71V14.1802C9.18 14.4302 9.5 14.9202 9.5 15.4902C9.5 16.3202 8.83 16.9902 8 16.9902C7.17 16.9902 6.5 16.3202 6.5 15.4902C6.5 14.9202 6.82 14.4302 7.29 14.1802V9.81024C6.82 9.56024 6.5 9.07023 6.5 8.50023C6.5 7.67023 7.17 7.00023 8 7.00023C8.83 7.00023 9.5 7.67023 9.5 8.50023C9.5 9.07023 9.18 9.56024 8.71 9.81024V11.2902H11.29V9.81024C10.82 9.56024 10.5 9.07023 10.5 8.50023C10.5 7.67023 11.17 7.00023 12 7.00023C12.83 7.00023 13.5 7.67023 13.5 8.50023C13.5 9.07023 13.18 9.56024 12.71 9.81024V11.2902H15C15.16 11.2902 15.29 11.1602 15.29 11.0002V9.81024C14.82 9.56024 14.5 9.07023 14.5 8.50023Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      </svg>
    ),
    label: "Transmission",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M18 9.71004H19C19.94 9.71004 20.71 8.94004 20.71 8.00004V4.00004C20.71 3.06004 19.94 2.29004 19 2.29004H18C17.06 2.29004 16.29 3.06004 16.29 4.00004V5.29004H14.29L12.5 3.50004C12.22 3.22004 11.77 3.22004 11.5 3.50004L9.71004 5.29004H7.71004V4.00004C7.71004 3.06004 6.94004 2.29004 6.00004 2.29004H5.00004C4.06004 2.29004 3.29004 3.06004 3.29004 4.00004V8.00004C3.29004 8.94004 4.06004 9.71004 5.00004 9.71004H6.00004C6.94004 9.71004 7.71004 8.94004 7.71004 8.00004V6.71004H9.71004L11.29 8.29004V15.7L9.71004 17.28H7.71004V15.99C7.71004 15.05 6.94004 14.28 6.00004 14.28H5.00004C4.06004 14.28 3.29004 15.05 3.29004 15.99V19.99C3.29004 20.93 4.06004 21.7 5.00004 21.7H6.00004C6.94004 21.7 7.71004 20.93 7.71004 19.99V18.7H9.71004L11.5 20.49C11.64 20.63 11.82 20.7 12 20.7C12.18 20.7 12.36 20.63 12.5 20.49L14.29 18.7H16.29V19.99C16.29 20.93 17.06 21.7 18 21.7H19C19.94 21.7 20.71 20.93 20.71 19.99V15.99C20.71 15.05 19.94 14.28 19 14.28H18C17.06 14.28 16.29 15.05 16.29 15.99V17.28H14.29L12.71 15.7V8.29004L14.29 6.71004H16.29V8.00004C16.29 8.94004 17.06 9.71004 18 9.71004ZM12 19L11 18L12 17L13 18L12 19ZM12 7.00004L11 6.00004L12 5.00004L13 6.00004L12 7.00004Z" fill="currentColor" />
      </svg>
    ),
    label: "DriveTrain",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M17.3607 15.1297L13.1807 11.9997L17.3607 8.86975C17.7907 8.53975 18.0407 8.04975 18.0407 7.49975C18.0407 6.94975 17.7907 6.45975 17.3607 6.12975L14.0307 3.62975C13.5107 3.23975 12.8207 3.17975 12.2407 3.46975C11.6607 3.75975 11.2907 4.34975 11.2907 4.99975V10.5797L7.09074 7.42975C6.78074 7.19975 6.33074 7.25975 6.10074 7.56975C5.86074 7.87975 5.93074 8.32975 6.24074 8.55975L10.8207 11.9897L6.24074 15.4197C5.93074 15.6597 5.86074 16.0997 6.10074 16.4097C6.24074 16.5997 6.45074 16.6897 6.67074 16.6897C6.82074 16.6897 6.97074 16.6397 7.10074 16.5497L11.3007 13.3997V18.9797C11.3007 19.6297 11.6607 20.2197 12.2507 20.5097C12.4907 20.6297 12.7607 20.6897 13.0207 20.6897C13.3807 20.6897 13.7407 20.5697 14.0407 20.3497L17.3707 17.8497C17.8007 17.5197 18.0507 17.0297 18.0507 16.4797C18.0507 15.9297 17.8007 15.4397 17.3707 15.1097L17.3607 15.1297ZM12.7107 4.99975C12.7107 4.83975 12.8107 4.76975 12.8707 4.73975C12.9007 4.71975 12.9507 4.70975 13.0007 4.70975C13.0507 4.70975 13.1107 4.72975 13.1707 4.76975L16.5007 7.26975C16.6007 7.34975 16.6207 7.44975 16.6207 7.49975C16.6207 7.54975 16.6107 7.65975 16.5007 7.72975L12.7007 10.5797V4.99975H12.7107ZM16.5107 16.7297L13.1807 19.2297C13.0607 19.3197 12.9407 19.2897 12.8807 19.2597C12.8207 19.2297 12.7207 19.1597 12.7207 18.9997V13.4197L16.5207 16.2697C16.6207 16.3497 16.6407 16.4497 16.6407 16.4997C16.6407 16.5497 16.6307 16.6597 16.5207 16.7297H16.5107Z" fill="currentColor" />
      </svg>
    ),
    label: "Electronics",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M9.99986 21.7099C9.90986 21.7099 9.81986 21.6899 9.72986 21.6599C9.42986 21.5399 9.24986 21.2199 9.28986 20.8999L10.1699 14.7099H5.98986C5.71986 14.7099 5.47986 14.5599 5.35986 14.3199C5.23986 14.0799 5.25986 13.7999 5.41986 13.5799L13.4299 2.57993C13.6199 2.31993 13.9699 2.21993 14.2699 2.33993C14.5699 2.45993 14.7499 2.77993 14.7099 3.09993L13.8299 9.28993H18.0099C18.2799 9.28993 18.5199 9.43993 18.6399 9.67993C18.7599 9.91993 18.7399 10.1999 18.5799 10.4199L10.5799 21.4199C10.4399 21.6099 10.2299 21.7099 10.0099 21.7099H9.99986ZM7.38986 13.2899H10.9999C11.2099 13.2899 11.3999 13.3799 11.5399 13.5299C11.6799 13.6899 11.7399 13.8899 11.7099 14.0999L11.1099 18.2699L16.6099 10.7099H12.9999C12.7899 10.7099 12.5999 10.6199 12.4599 10.4699C12.3199 10.3099 12.2599 10.1099 12.2899 9.89993L12.8899 5.72993L7.38986 13.2899Z" fill="currentColor" />
      </svg>
    ),
    label: "Electrical systems",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M21.71 12C21.71 11.29 21.62 10.55 21.45 9.82005C20.43 5.39005 16.54 2.30005 12 2.30005C7.46004 2.30005 3.57004 5.39005 2.55004 9.82005C2.38004 10.55 2.29004 11.29 2.29004 12C2.29004 12.36 2.31004 12.72 2.35004 13.08C2.82004 17.36 6.12004 20.85 10.38 21.56C10.96 21.66 11.49 21.7001 12 21.7001C12.51 21.7001 13.04 21.65 13.61 21.56C17.86 20.85 21.16 17.36 21.64 13.08C21.68 12.73 21.7 12.37 21.7 12H21.71ZM12 3.71005C15.54 3.71005 18.61 5.91005 19.79 9.16005L14.06 8.52005C12.69 8.37005 11.31 8.37005 9.95004 8.52005L4.22004 9.16005C5.40004 5.91005 8.47004 3.71005 12.01 3.71005H12ZM3.88004 13.71H6.50004C8.32004 13.71 9.79004 15.19 9.79004 17V19.99C6.81004 19.17 4.51004 16.73 3.88004 13.71ZM11.2 20.26V17.01C11.2 14.42 9.09004 12.3 6.49004 12.3H3.70004C3.70004 12.2 3.70004 12.1 3.70004 12.01C3.70004 11.56 3.74004 11.09 3.82004 10.63L10.09 9.93005C11.35 9.79005 12.63 9.79005 13.89 9.93005L20.16 10.63C20.24 11.1 20.28 11.56 20.28 12.01C20.28 12.11 20.28 12.21 20.28 12.3H17.49C14.9 12.3 12.78 14.41 12.78 17.01V20.26C12.23 20.32 11.74 20.32 11.19 20.26H11.2ZM14.2 20V17.01C14.2 15.19 15.68 13.72 17.49 13.72H20.11C19.48 16.74 17.18 19.18 14.2 20Z" fill="currentColor" />
      </svg>
    ),
    label: "Steering",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M4.29004 8.00035C4.29004 8.39035 4.61004 8.71035 5.00004 8.71035C5.39004 8.71035 5.71004 8.39035 5.71004 8.00035V4.71035L6.50004 5.50035C6.64004 5.64035 6.82004 5.71035 7.00004 5.71035C7.18004 5.71035 7.36004 5.64035 7.50004 5.50035C7.78004 5.22035 7.78004 4.77035 7.50004 4.50035L5.50004 2.50035C5.43004 2.43035 5.36004 2.38035 5.27004 2.35035C5.10004 2.28035 4.90004 2.28035 4.73004 2.35035C4.64004 2.39035 4.56004 2.44035 4.50004 2.50035L2.50004 4.50035C2.22004 4.78035 2.22004 5.23035 2.50004 5.50035C2.78004 5.77035 3.23004 5.78035 3.50004 5.50035L4.29004 4.71035V8.00035Z" fill="currentColor" />
        <path d="M21.5 18.5004C21.22 18.2204 20.77 18.2204 20.5 18.5004L19.71 19.2904V16.0004C19.71 15.6104 19.39 15.2904 19 15.2904C18.61 15.2904 18.29 15.6104 18.29 16.0004V19.2904L17.5 18.5004C17.22 18.2204 16.77 18.2204 16.5 18.5004C16.23 18.7804 16.22 19.2304 16.5 19.5004L18.5 21.5004C18.57 21.5704 18.64 21.6204 18.73 21.6504C18.82 21.6904 18.91 21.7004 19 21.7004C19.09 21.7004 19.18 21.6804 19.27 21.6504C19.36 21.6104 19.44 21.5604 19.5 21.5004L21.5 19.5004C21.78 19.2204 21.78 18.7704 21.5 18.5004Z" fill="currentColor" />
        <path d="M16.18 12.2204C16.31 12.3104 16.45 12.3504 16.59 12.3504C16.81 12.3504 17.03 12.2504 17.17 12.0504C17.4 11.7304 17.32 11.2904 17 11.0604L15.21 9.78035L16.31 8.68035C16.72 8.92035 17.18 9.05035 17.65 9.05035C18.34 9.05035 19.04 8.79035 19.57 8.26035C20.63 7.20035 20.63 5.48035 19.57 4.43035C18.51 3.37035 16.79 3.38035 15.74 4.43035C14.86 5.31035 14.72 6.65035 15.31 7.69035L14.04 8.96035L12.05 7.54035C11.73 7.31035 11.29 7.39035 11.06 7.71035C10.83 8.03035 10.91 8.47035 11.23 8.70035L13.02 9.98035L11.92 11.0804L9.93004 9.66035C9.61004 9.43035 9.17004 9.51035 8.94004 9.83035C8.71004 10.1504 8.79004 10.5904 9.11004 10.8204L10.9 12.1004L9.80004 13.2004L7.81004 11.7804C7.49004 11.5504 7.05004 11.6304 6.82004 11.9504C6.59004 12.2704 6.67004 12.7104 6.99004 12.9404L8.78004 14.2204L7.68004 15.3204C6.65004 14.7304 5.31004 14.8704 4.42004 15.7504C3.36004 16.8104 3.36004 18.5304 4.42004 19.5804C4.95004 20.1104 5.64004 20.3704 6.34004 20.3704C7.04004 20.3704 7.73004 20.1104 8.26004 19.5804C9.14004 18.7004 9.28004 17.3604 8.69004 16.3204L9.96004 15.0504L11.95 16.4704C12.07 16.5604 12.22 16.6004 12.36 16.6004C12.58 16.6004 12.8 16.5004 12.94 16.3004C13.17 15.9804 13.09 15.5404 12.77 15.3104L10.98 14.0304L12.08 12.9304L14.07 14.3504C14.2 14.4404 14.34 14.4804 14.48 14.4804C14.7 14.4804 14.92 14.3804 15.06 14.1804C15.29 13.8604 15.21 13.4204 14.89 13.1904L13.1 11.9104L14.2 10.8104L16.19 12.2304L16.18 12.2204ZM16.74 5.43035C16.99 5.18035 17.32 5.05035 17.65 5.05035C17.98 5.05035 18.31 5.18035 18.56 5.43035C19.06 5.93035 19.06 6.75035 18.56 7.25035C18.06 7.75035 17.24 7.75035 16.73 7.25035C16.23 6.75035 16.23 5.93035 16.73 5.43035H16.74ZM7.26004 18.5704C6.76004 19.0704 5.94004 19.0704 5.44004 18.5704C4.94004 18.0704 4.94004 17.2504 5.44004 16.7504C5.69004 16.5004 6.02004 16.3704 6.35004 16.3704C6.68004 16.3704 7.01004 16.5004 7.26004 16.7504C7.76004 17.2504 7.76004 18.0704 7.26004 18.5704Z" fill="currentColor" />
      </svg>
    ),
    label: "Suspension",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M21.1102 13.22L17.3002 14.24L15.7102 13.32V10.68L17.3002 9.76004L21.1102 10.78C21.1702 10.8 21.2302 10.8 21.2902 10.8C21.6002 10.8 21.8902 10.59 21.9802 10.27C22.0802 9.89004 21.8602 9.50004 21.4802 9.40004L19.0402 8.75004L21.0202 7.61004C21.3602 7.41004 21.4802 6.98004 21.2802 6.64004C21.0802 6.30004 20.6502 6.18004 20.3102 6.38004L18.3302 7.52004L18.9802 5.08004C19.0802 4.70004 18.8602 4.31004 18.4802 4.21004C18.1002 4.11004 17.7102 4.33004 17.6102 4.71004L16.5902 8.52004L15.0002 9.44004L12.7102 8.12004V6.29004L15.5002 3.50004C15.7802 3.22004 15.7802 2.77004 15.5002 2.50004C15.2202 2.23004 14.7702 2.22004 14.5002 2.50004L12.7102 4.29004V2.00004C12.7102 1.61004 12.3902 1.29004 12.0002 1.29004C11.6102 1.29004 11.2902 1.61004 11.2902 2.00004V4.29004L9.50018 2.50004C9.22018 2.22004 8.77018 2.22004 8.50018 2.50004C8.23018 2.78004 8.22018 3.23004 8.50018 3.50004L11.2902 6.29004V8.12004L9.00018 9.44004L7.41018 8.52004L6.39018 4.71004C6.29018 4.33004 5.90018 4.11004 5.52018 4.21004C5.14018 4.31004 4.92018 4.70004 5.02018 5.08004L5.67018 7.52004L3.69018 6.38004C3.35018 6.19004 2.92018 6.30004 2.72018 6.64004C2.52018 6.98004 2.64018 7.41004 2.98018 7.61004L4.96018 8.75004L2.52018 9.40004C2.14018 9.50004 1.92018 9.89004 2.02018 10.27C2.11018 10.59 2.39018 10.8 2.71018 10.8C2.77018 10.8 2.83018 10.8 2.89018 10.78L6.70018 9.76004L8.29018 10.68V13.32L6.70018 14.24L2.89018 13.22C2.51018 13.12 2.12018 13.34 2.02018 13.72C1.92018 14.1 2.14018 14.49 2.52018 14.59L4.96018 15.24L2.98018 16.38C2.64018 16.58 2.52018 17.01 2.72018 17.35C2.85018 17.58 3.09018 17.7 3.34018 17.7C3.46018 17.7 3.58018 17.67 3.69018 17.6L5.67018 16.46L5.02018 18.9C4.92018 19.28 5.14018 19.67 5.52018 19.77C5.58018 19.79 5.64018 19.79 5.70018 19.79C6.01018 19.79 6.30018 19.58 6.39018 19.26L7.41018 15.45L9.00018 14.53L11.2902 15.85V17.68L8.50018 20.47C8.22018 20.75 8.22018 21.2 8.50018 21.47C8.78018 21.74 9.23018 21.75 9.50018 21.47L11.2902 19.68V21.97C11.2902 22.36 11.6102 22.68 12.0002 22.68C12.3902 22.68 12.7102 22.36 12.7102 21.97V19.68L14.5002 21.47C14.6402 21.61 14.8202 21.68 15.0002 21.68C15.1802 21.68 15.3602 21.61 15.5002 21.47C15.7802 21.19 15.7802 20.74 15.5002 20.47L12.7102 17.68V15.85L15.0002 14.53L16.5902 15.45L17.6102 19.26C17.6902 19.58 17.9802 19.79 18.3002 19.79C18.3602 19.79 18.4202 19.79 18.4802 19.77C18.8602 19.67 19.0802 19.28 18.9802 18.9L18.3302 16.46L20.3102 17.6C20.4202 17.66 20.5402 17.7 20.6602 17.7C20.9102 17.7 21.1402 17.57 21.2802 17.35C21.4802 17.01 21.3602 16.58 21.0202 16.38L19.0402 15.24L21.4802 14.59C21.8602 14.49 22.0802 14.1 21.9802 13.72C21.8802 13.34 21.4902 13.12 21.1102 13.22ZM9.71018 13.32V10.68L12.0002 9.36004L14.2902 10.68V13.32L12.0002 14.64L9.71018 13.32Z" fill="currentColor" />
      </svg>
    ),
    label: "Cooling systems",
  },
  {
    icon: (props: any) => (
      <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
        <path d="M17.21 12C17.21 11.61 16.89 11.29 16.5 11.29C16.11 11.29 15.79 11.61 15.79 12C15.79 12.64 15.62 12.92 15.39 13.3C15.12 13.75 14.79 14.3 14.79 15.33C14.79 16.36 15.12 16.92 15.39 17.36C15.62 17.75 15.79 18.03 15.79 18.66C15.79 19.29 15.62 19.57 11.39 19.96C11.12 20.41 10.79 20.96 10.79 21.99C10.79 22.38 11.11 22.7 11.5 22.7C11.89 22.7 12.21 22.38 12.21 21.99C12.21 21.35 12.38 21.08 12.61 20.69C12.88 20.24 13.21 19.69 13.21 18.66C13.21 17.63 12.88 17.07 12.61 16.63C12.38 16.24 12.21 15.96 12.21 15.33C12.21 14.7 12.38 14.41 12.61 14.03C12.88 13.58 13.21 13.03 13.21 12Z" fill="currentColor" />
        <path d="M13.21 12C13.21 11.61 12.89 11.29 12.5 11.29C12.11 11.29 11.79 11.61 11.79 12C11.79 12.64 11.62 12.92 11.39 13.3C11.12 13.75 10.79 14.3 10.79 15.33C10.79 16.36 11.12 16.92 11.39 17.36C11.62 17.75 11.79 18.03 11.79 18.66C11.79 19.29 11.62 19.57 11.39 19.96C11.12 20.41 10.79 20.96 10.79 21.99C10.79 22.38 11.11 22.7 11.5 22.7C11.89 22.7 12.21 22.38 12.21 21.99C12.21 21.35 12.38 21.08 12.61 20.69C12.88 20.24 13.21 19.69 13.21 18.66C13.21 17.63 12.88 17.07 12.61 16.63C12.38 16.24 12.21 15.96 12.21 15.33C12.21 14.7 12.38 14.41 12.61 14.03C12.88 13.58 13.21 13.03 13.21 12Z" fill="currentColor" />
        <path d="M9.21004 12C9.21004 11.61 8.89004 11.29 8.50004 11.29C8.11004 11.29 7.79004 11.61 7.79004 12C7.79004 12.64 7.62004 12.92 7.39004 13.3C7.12004 13.75 6.79004 14.3 6.79004 15.33C6.79004 16.36 7.12004 16.92 7.39004 17.36C7.62004 17.75 7.79004 18.03 7.79004 18.66C7.79004 19.29 7.62004 19.57 7.39004 19.96C7.12004 20.41 6.79004 20.96 6.79004 21.99C6.79004 22.38 7.11004 22.7 7.50004 22.7C7.89004 22.7 8.21004 22.38 8.21004 21.99C8.21004 21.35 8.38004 21.08 8.61004 20.69C8.88004 20.24 9.21004 19.69 9.21004 18.66C9.21004 17.63 8.88004 17.07 8.61004 16.63C8.38004 16.24 8.21004 15.96 8.21004 15.33C8.21004 14.7 8.38004 14.41 8.61004 14.03C8.88004 13.58 9.21004 13.03 9.21004 12Z" fill="currentColor" />
        <path d="M16.75 2.29004H7.25004C4.65004 2.29004 2.54004 4.40004 2.54004 7.00004V13C2.54004 14.57 3.32004 16.03 4.62004 16.91C4.74004 16.99 4.88004 17.03 5.02004 17.03C5.25004 17.03 5.47004 16.92 5.61004 16.72C5.83004 16.4 5.74004 15.95 5.42004 15.73C4.51004 15.12 3.97004 14.1 3.97004 13V7.00004C3.97004 5.19004 5.45004 3.71004 7.26004 3.71004H16.76C18.57 3.71004 20.05 5.19004 20.05 7.00004V13C20.05 14.09 19.51 15.11 18.61 15.72C18.29 15.94 18.2 16.38 18.42 16.71C18.64 17.03 19.08 17.12 19.41 16.9C20.7 16.02 21.47 14.56 21.47 13.01V7.01004C21.47 4.41004 19.36 2.30004 16.76 2.30004L16.75 2.29004Z" fill="currentColor" />
      </svg>
    ),
    label: "Climate Control",
  },
];

const includedFeatures = [
  {
    icon: Truck,
    title: "24/7 roadside assistance & towing",
    body: "Help is always a call away. Roadside and towing services are available 365 days a year and start the moment your warranty plan begins.",
  },
  {
    icon: Wallet,
    title: "No out-of-pocket costs",
    body: "Save $100 on your deductible when your repairs are completed at one of dealership Service Center.",
  },
  {
    icon: MapPin,
    title: "Nationwide protection",
    body: "Drive with confidence knowing you're protected across Canada and the United States.",
  },
  {
    icon: KeyRound,
    title: "Lost Key & Lockout Assistance",
    body: "Locked out or misplaced your keys? Your warranty plan helps cover the cost of locksmith services.",
  },
  {
    icon: Car,
    title: "Rental car coverage",
    body: "If your vehicle needs a covered repair, we help cover the cost of a rental vehicle—up to $40 per day.",
  },
];

/* Animation Configurations */
const containerVariants:Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { type: "spring", staggerChildren: 0.1 } }
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const ProtectionPlans = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-9 pb-0 md:pt-20 overflow-hidden bg-white px-0 lg:mt-18">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-0 flex flex-col lg:flex-row lg:items-center justify-between min-h-[450px]">

          {/* Left Column: Title and Pills */}
          <div className="flex flex-col justify-center space-y-6 max-w-md pb-12 md:pb-12 z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-tight md:w-xl"
            >
              Every Vehicle Includes
            </motion.h1>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col gap-4 pt-4 pr-14 lg:pr-0"
            >
              {includes.map(({ label }) => (
                <motion.div
                  variants={itemVariants}
                  key={label}
                  className="flex items-center gap-3 bg-[#e6f4ff] rounded-full px-5 py-4 w-full sm:w-80 shadow-[0_2px_18px_rgba(0,0,0,0.1)]"
                >
                  <Check className="h-6 w-6 text-emerald-500 shrink-0" strokeWidth={2} />
                  <span className="text-base font-medium text-neutral-800">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:absolute lg:bottom-0 lg:right-32 2xl:right-64 lg:w-1/2 lg:w-[45%] flex justify-end items-end pointer-events-none"
          >
            <Image
              src={rotateCar}
              alt="Silver Toyota Camry Sedan"
              loading="eager"
              className="object-contain w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[480px] 2xl:max-h-[400px] object-bottom"
            />
          </motion.div>

        </div>
      </section>

      {/* Section 2: We stand behind our cars */}
      <section className="w-full bg-[#e6f4ff] border-t border-neutral-100/60 py-14 md:py-20 xl:mt-20 mt-7">
        <div className="mx-auto xl:max-w-[1240px] px-5 md:px-1 flex flex-col items-center text-center">

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-[26px] md:text-5xl font-bold text-neutral-900 leading-none xl:max-w-[650px]"
          >
            We stand behind our cars so much, you get:
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-14 w-full max-w-xl divide-y divide-blue-100/80 border-t border-b border-blue-100/80"
          >
            {standBehind.map((item) => (
              <motion.div
                variants={itemVariants}
                key={item}
                className="flex items-center justify-between py-3.5 text-left"
              >
                <span className="text-base font-medium text-neutral-800">{item}</span>
                <Check className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* How Cardora keeps you covered */}
      <section className="bg-[#eaeff5] py-16 md:py-20 px-0">
        <div className="mx-auto max-w-[1240px] px-6 md:px-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-[45px] font-semibold tracking-tight text-foreground">
              How {SITE_CONFIG?.dealership.name} keeps you covered
            </h2>
            <p className="mt-4 text-black text-base">
              Every plan covers major systems and parts on your car, with deductibles starting as low as $50 on any car you choose.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 flex lg:grid lg:grid-cols-6 gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-none pb-2 lg:pb-0"
          >
            {coveredSystems.map(({ icon: Icon, label }) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                key={label}
                className="w-ful min-w-[160px] sm:min-w-[180px] lg:min-w-0 shrink-0 lg:shrink grow bg-card border border-[#00b066] rounded-xl text-[#00b066] hover:text-white hover:bg-gradient-to-b from-[#00af66] to-[#00af66a6] cursor-pointer px-4 py-3 flex items-center justify-center gap-3 transition-colors duration-200"
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                <p className="mt-1 text-sm whitespace-nowrap lg:whitespace-normal">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="lg:py-1 bg-[#eaeff5] px-0">
        <div className="mx-auto max-w-[1240px] px-6 md:px-1 pb-10">
          <h2 className="text-start text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-7">
            What's included?
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-7"
          >
            {includedFeatures.map(({ icon: Icon, title, body }) => (
              <motion.div
                variants={itemVariants}
                key={title}
                className="rounded-2xl py-2 flex justify-start items-start gap-4"
              >
                <div className="max-h-8 max-w-8 p-1 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                  <Check className="text-white w-4 h-4" strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-base leading-6">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gap Coverage */}
      <section className="text-gray-900 pt-18 py-1 lg:px-4 font-sans">
        <div className="max-w-[1240px] mx-auto px-6 md:px-1 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">
              Gap Coverage
            </h2>
            <div className="mt-2">
              <span className="inline-block bg-[#e6f4ff] text-base px-8 py-3 rounded-full uppercase tracking-wider shadow-[0_2px_18px_rgba(0,0,0,0.05)]">
                Optional
              </span>
            </div>
            <p className="mt-4 text-base mx-auto max-w-5xl leading-relaxed text-black">
              Life doesn't wait. If your vehicle is totaled or stolen, insurance may not cover what you still owe.
              GAP coverage protects you by covering the remaining balance — so you're not left paying for a
              car you no longer have.
            </p>
          </motion.div>

          {/* Breakdown Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <p className="uppercase mb-1 font-medium">Example</p>
            <p className="text-xl font-normal my-1">If You Owed on Your Vehicle</p>
            <p className="text-3xl md:text-3xl font-black text-emerald-600 mt-1">$15,000</p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 border-t border-gray-200 mx-auto items-start text-center mt-8"
            >
              {/* Left Column: Payout */}
              <div className="pt-6 md:pt-10 pb-6 md:pb-0 border-b border-gray-300 md:border-b-0">
                <p className="text-lg text-gray-800">Insurance Payout</p>
                <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">$11,000</p>
              </div>

              {/* Right Column: Gap */}
              <div className="pt-8 md:pt-10 md:border-l md:border-gray-300 md:pl-10">
                <p className="text-lg text-gray-800">Amount Owed (GAP)</p>
                <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">$4,000</p>
                <p className="mt-2 text-md mx-auto leading-normal max-w-sm md:max-w-none text-gray-600">
                  GAP coverage protects you from the amount still owed.
                </p>
              </div>
            </motion.div>

            {/* Visual Asset Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex justify-center"
            >
              <Image
                src={greenCar}
                alt="Vehicle visualization split with checklist indicators"
                className="w-full h-auto max-w-md md:max-w-4xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-0 md:gap-4 border-t border-gray-200 mx-auto items-start text-center"
            >
              {/* Left Column: Payout */}
              <div className="pt-6 md:pt-10 pb-6 md:pb-0 border-b border-gray-300 md:border-b-0">
                <p className="text-lg font-bold text-gray-800">Insurance Payout</p>
                <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">$15,000</p>
              </div>

              {/* Right Column: Gap */}
              <div className="pt-8 md:pt-10 md:border-l md:border-gray-300 md:pl-10">
                <p className="text-lg font-bold text-gray-800">Amount Owed (GAP)</p>
                <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">$3,000</p>
                <p className="mt-2 text-md mx-auto leading-normal max-w-sm md:max-w-none">
                  GAP coverage protects you from the amount still owed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Cardora Difference Section */}
      <div className="w-full mx-auto lg:mb-5 lg:px-28 lg:-mt-20 -mt-5">
        <CardoraDifference />
      </div>

      <GetInTouch />
      <Footer />
    </div>
  );
};

export default ProtectionPlans;