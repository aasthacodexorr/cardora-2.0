/* =========================
   Site Constants & Configuration
   Central place for all site-wide configuration:
   - Navigation items
   - Contact information (phone, email, fax)
   - Address & social media links
   - Business hours
   - Dealership info
   - Site configuration
   - API endpoints & Typesense config
========================= */

import { AppConfig, fallbackValue, defaultAppConfig } from "@/lib/appConfig";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: "Shop", to: "/inventory" },
  { label: "Sell/Trade", to: "/trade-in" },
  { label: "Finance", to: "/financing" },
  { label: "Protection Plans", to: "/protection-plans" },
  { label: "Service", to: "/service" },
  { label: "Why Cardora?", to: "/about-us" },
] as const;




export const getConstants = (appConfig: AppConfig) => {
  const defaultD = defaultAppConfig.dealership;
  const d = appConfig.dealership;

  // Create safe config with fallback values
  const safeD = {
    dealership_name: fallbackValue(d.dealership_name, defaultD.dealership_name),
    dealership_logo: fallbackValue(d.dealership_logo, defaultD.dealership_logo),
    full_address_1: fallbackValue(d.full_address_1, defaultD.full_address_1),
    city_1: fallbackValue(d.city_1, defaultD.city_1),
    province_1: fallbackValue(d.province_1, defaultD.province_1),
    postal_code_1: fallbackValue(d.postal_code_1, defaultD.postal_code_1),
    country_1: fallbackValue(d.country_1, defaultD.country_1),
    address_map_url_1: fallbackValue(d.address_map_url_1, defaultD.address_map_url_1),
    address_1_bar: fallbackValue(d.address_1_bar, defaultD.address_1_bar),
    toll_free_number_1: fallbackValue(d.toll_free_number_1, defaultD.toll_free_number_1),
    toll_free_number_2: fallbackValue(d.toll_free_number_2, defaultD.toll_free_number_2),
    sales_number_1: fallbackValue(d.sales_number_1, defaultD.sales_number_1),
    sales_number_2: fallbackValue(d.sales_number_2, defaultD.sales_number_2),
    cell_phone_1: fallbackValue(d.cell_phone_1, defaultD.cell_phone_1),
    cell_phone_2: fallbackValue(d.cell_phone_2, defaultD.cell_phone_2),
    fax_number_1: fallbackValue(d.fax_number_1, defaultD.fax_number_1),
    fax_number_2: fallbackValue(d.fax_number_2, defaultD.fax_number_2),
    email_1: fallbackValue(d.email_1, defaultD.email_1),
    email_2: fallbackValue(d.email_2, defaultD.email_2),
    social_media_facebook: fallbackValue(d.social_media_facebook, defaultD.social_media_facebook),
    social_media_instagram: fallbackValue(d.social_media_instagram, defaultD.social_media_instagram),
    social_media_twitter: fallbackValue(d.social_media_twitter, defaultD.social_media_twitter),
    social_media_youtube: fallbackValue(d.social_media_youtube, defaultD.social_media_youtube),
    social_media_tiktok: fallbackValue(d.social_media_tiktok, defaultD.social_media_tiktok),
    social_media_google_review: fallbackValue(d.social_media_google_review, defaultD.social_media_google_review),
    default_placeholder_image: fallbackValue(d.default_placeholder_image, defaultD.default_placeholder_image),
    working_hours: d.working_hours ?? defaultD.working_hours,
  };

  const workingHours = safeD.working_hours ?? [];

  const getHours = (day: string) =>
    workingHours.find(({ day: d }: any) => d === day)?.hours ?? "Closed";

  const mondayToFriday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const weekdayHours =
    mondayToFriday.every((day) => getHours(day) === getHours("Monday"))
      ? getHours("Monday")
      : mondayToFriday.map((day) => `${day}: ${getHours(day)}`).join(", ");

  return {
    PHONE_NUMBER: safeD.sales_number_1 || safeD.toll_free_number_1,
    PHONE_HREF: `tel:${safeD.sales_number_1 || safeD.toll_free_number_1}`,
    PHONE_NUMBER_2: safeD.toll_free_number_2,
    PHONE_HREF_2: `tel:${safeD.toll_free_number_2}`,
    SALES_PHONE_NUMBER: safeD.sales_number_1,
    SALES_PHONE_HREF: `tel:${safeD.sales_number_1}`,
    SALES_PHONE_NUMBER_2: safeD.sales_number_2,
    SALES_PHONE_HREF_2: `tel:${safeD.sales_number_2}`,
    CELL_PHONE_1: safeD.cell_phone_1,
    CELL_PHONE_HREF_1: `tel:${safeD.cell_phone_1}`,
    CELL_PHONE_2: safeD.cell_phone_2,
    CELL_PHONE_HREF_2: `tel:${safeD.cell_phone_2}`,
    FAX_NUMBER_1: safeD.fax_number_1,
    FAX_NUMBER_2: safeD.fax_number_2,
    EMAIL_1: safeD.email_1,
    EMAIL_2: safeD.email_2,

    ADDRESS: {
      street: safeD.full_address_1,
      city: safeD.city_1,
      province: safeD.province_1,
      postalCode: safeD.postal_code_1,
      country: safeD.country_1,
      mapUrl: safeD.address_map_url_1 || safeD.address_1_bar,
    } as const,

    SOCIAL_LINKS: {
      facebook: safeD.social_media_facebook,
      instagram: safeD.social_media_instagram,
      twitter: safeD.social_media_twitter,
      youtube: safeD.social_media_youtube,
      tiktok: safeD.social_media_tiktok,
      googleReview: safeD.social_media_google_review,
    } as const,

    BUSINESS_HOURS_SALES: {
      weekdays: {
        label: "Mon-Fri",
        hours: "10:00 AM to 8:00 PM",
      },
      saturday: {
        label: "Saturday",
        hours: "10:00 AM to 6:00 PM",
      },
      sunday: {
        label: "Sunday",
        hours: "12:00 PM to 5:00 PM",
      },
    } as const,

    BUSINESS_HOURS_SERVICES: {
      weekdays: {
        label: "Mon-Fri",
        hours: "8:30 AM to 6:00 PM",
      },
      saturday: {
        label: "Saturday",
        hours: "9:00 AM to 2:00 PM",
      },
      sunday: {
        label: "Sunday",
        hours: "Closed"
      },
    } as const,

    DEALERSHIP_NAME: safeD.dealership_name,
    DEFAULT_PLACEHOLDER_IMAGE: safeD.default_placeholder_image,
    DEALERSHIP_LOGO: safeD.dealership_logo,
    INVENTORY_PRICING_VERBAGE: appConfig.site.inventory_pricing_verbage,
    DEFAULT_SORT: appConfig.site.default_sort,
    CDN_API: appConfig.site.cdn_api,
    SAAS_API: appConfig.site.saas_api,
    COLLECTION_ID: appConfig.site.collection,
    TYPESENSE_HOST: appConfig.site.typesense_host,
    TYPESENSE_PORT: appConfig.site.typesense_port,
    TYPESENSE_PROTOCOL: appConfig.site.typesense_protocol,
    INVENTORY_SLUG: appConfig.site.inventory_slug,

    SITE_CONFIG: {
      urls: {
        financeBaseUrl: "https://cardora.zopsoftware.com/api/templates/render/16",
        financeRenderApiUrl: "https://cardora.zopsoftware.com/api/templates/render/15",
        assetBaseUrl: appConfig.site.cdn_api,
        googleMapsUrl: safeD.address_map_url_1 || safeD.address_1_bar,
        tradeFormByVehicle: "https://cardora.zopsoftware.com/api/templates/render/17",
        tradeFormByVin: "https://cardora.zopsoftware.com/api/templates/render/18",
        bookAppointment:"https://cardora.zopsoftware.com/api/templates/render/23"
      },
      api: {
        saasApi: appConfig.site.saas_api,
        cdnApi: appConfig.site.cdn_api,
      },
      inventory: {
        defaultSort: appConfig.site.default_sort,
        collectionId: appConfig.site.collection,
        slug: appConfig.site.inventory_slug,
        pricingVerbage: appConfig.site.inventory_pricing_verbage,
      },
      typesense: {
        host: appConfig.site.typesense_host,
        port: appConfig.site.typesense_port,
        protocol: appConfig.site.typesense_protocol,
      },
      social: {
        facebook: safeD.social_media_facebook,
        instagram: safeD.social_media_instagram,
      },
      dealership: {
        name: safeD.dealership_name,
        logo: safeD.dealership_logo,
        placeholderImage: safeD.default_placeholder_image,
      },
      recaptchaSiteKey: "6Lf4uTMtAAAAABXoMsZBjTFgt43oeVgc5BjzlNTW"
    } as const
  }
}
