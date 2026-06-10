/* =========================
   Site Constants
   Central place for all static
   site-wide configuration values:
   phone numbers, addresses, nav items,
   and external URLs.
========================= */

//  Navigation 
export const NAV_ITEMS = [
  { label: "Shop", to: "/inventory" },
  { label: "Sell/Trade", to: "/trade-in" },
  { label: "Finance", to: "/financing" },
  { label: "Protection Plans", to: "/protection-plans" },
  { label: "Service", to: "/service" },
  { label: "Why Cardora?", to: "/about-us" },
] as const;

//  Contact 
export const PHONE_NUMBER = "1-855-514-5500";
export const PHONE_HREF = "tel:1-855-514-5500";

export const ADDRESS = {
  street: "8050 Dixie Rd",
  city: "Brampton",
  province: "ON",
  postalCode: "L6T 4W6",
} as const;

//  Social 
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
} as const;

//  Business Hours 
export const BUSINESS_HOURS_SALES = {
  weekdays: { label: "Mon-Fri", hours: "10:00 AM to 8:00 PM" },
  saturday: { label: "Saturday", hours: "10:00 AM to 6:00 PM" },
  sunday: { label: "Sunday", hours: "12:00 PM to 5:00 PM" },
} as const;

export const BUSINESS_HOURS_SERVICES = {
  weekdays: { label: "Mon-Fri", hours: "08:30 AM to 06:00 PM" },
  saturday: { label: "Saturday", hours: "09:00 AM to 02:00 PM" },
  sunday: { label: "Sunday", hours: "Closed" },
} as const;

