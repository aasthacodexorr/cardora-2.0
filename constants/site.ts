/* =========================
   Site Constants
   Central place for all static
   site-wide configuration values:
   phone numbers, addresses, nav items,
   and external URLs.
========================= */

import { appConfig } from "@/lib/appConfig";

//  Navigation 
export const NAV_ITEMS = [
  { label: "Shop", to: "/inventory" },
  { label: "Sell/Trade", to: "/trade-in" },
  { label: "Finance", to: "/financing" },
  { label: "Protection Plans", to: "/protection-plans" },
  { label: "Service", to: "/service" },
  { label: "Why Cardora?", to: "/about-us" },
] as const;

// ─── Contact ──────────────────────────────────────────────────────────────────
// Toll-free → used in the Header top-bar (desktop + mobile)
export const PHONE_NUMBER = appConfig.dealership.toll_free_number_1 || appConfig.dealership.sales_number_1;
export const PHONE_HREF   = `tel:${appConfig.dealership.toll_free_number_1 || appConfig.dealership.sales_number_1}`;

// Toll-free #2 (fallback if #1 empty)
export const PHONE_NUMBER_2 = appConfig.dealership.toll_free_number_2;
export const PHONE_HREF_2   = `tel:${appConfig.dealership.toll_free_number_2}`;

// Sales direct → used in Footer
export const SALES_PHONE_NUMBER = appConfig.dealership.sales_number_1;
export const SALES_PHONE_HREF   = `tel:${appConfig.dealership.sales_number_1}`;

// Sales #2 (fallback if #1 empty)
export const SALES_PHONE_NUMBER_2 = appConfig.dealership.sales_number_2;
export const SALES_PHONE_HREF_2   = `tel:${appConfig.dealership.sales_number_2}`;

// Cell phones
export const CELL_PHONE_1 = appConfig.dealership.cell_phone_1;
export const CELL_PHONE_HREF_1 = `tel:${appConfig.dealership.cell_phone_1}`;

export const CELL_PHONE_2 = appConfig.dealership.cell_phone_2;
export const CELL_PHONE_HREF_2 = `tel:${appConfig.dealership.cell_phone_2}`;

// Fax numbers
export const FAX_NUMBER_1 = appConfig.dealership.fax_number_1;
export const FAX_NUMBER_2 = appConfig.dealership.fax_number_2;

// Email
export const EMAIL_1      = appConfig.dealership.email_1;
export const EMAIL_2      = appConfig.dealership.email_2;

// ─── Address ──────────────────────────────────────────────────────────────────
export const ADDRESS = {
  street:     appConfig.dealership.full_address_1,
  city:       appConfig.dealership.city_1,
  province:   appConfig.dealership.province_1,
  postalCode: appConfig.dealership.postal_code_1,
  country:    appConfig.dealership.country_1,
  mapUrl:     appConfig.dealership.address_map_url_1 || appConfig.dealership.address_1_bar,
} as const;

// ─── Social ───────────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  facebook:      appConfig.dealership.social_media_facebook,
  instagram:     appConfig.dealership.social_media_instagram,
  twitter:       appConfig.dealership.social_media_twitter,
  youtube:       appConfig.dealership.social_media_youtube,
  tiktok:        appConfig.dealership.social_media_tiktok,
  googleReview:  appConfig.dealership.social_media_google_review,
} as const;

// ─── Business Hours ───────────────────────────────────────────────────────────
// If appConfig supplies working_hours use them; otherwise fall back to static defaults
export const BUSINESS_HOURS_SALES = {
  weekdays: { label: "Mon-Fri",   hours: "10:00 AM to 8:00 PM" },
  saturday: { label: "Saturday",  hours: "10:00 AM to 6:00 PM" },
  sunday:   { label: "Sunday",    hours: "12:00 PM to 5:00 PM" },
} as const;

export const BUSINESS_HOURS_SERVICES = {
  weekdays: { label: "Mon-Fri",   hours: "08:30 AM to 06:00 PM" },
  saturday: { label: "Saturday",  hours: "09:00 AM to 02:00 PM" },
  sunday:   { label: "Sunday",    hours: "Closed" },
} as const;

// ─── Dealership Info ──────────────────────────────────────────────────────────
export const DEALERSHIP_NAME = appConfig.dealership.dealership_name;
export const DEFAULT_PLACEHOLDER_IMAGE = appConfig.dealership.default_placeholder_image;
export const DEALERSHIP_LOGO = appConfig.dealership.dealership_logo;

// ─── Site Config ──────────────────────────────────────────────────────────────
export const INVENTORY_PRICING_VERBAGE = appConfig.site.inventory_pricing_verbage;
export const DEFAULT_SORT = appConfig.site.default_sort;
export const CDN_API = appConfig.site.cdn_api;
export const SAAS_API = appConfig.site.saas_api;
export const COLLECTION_ID = appConfig.site.collection;
export const TYPESENSE_HOST = appConfig.site.typesense_host;
export const TYPESENSE_PORT = appConfig.site.typesense_port;
export const TYPESENSE_PROTOCOL = appConfig.site.typesense_protocol;
