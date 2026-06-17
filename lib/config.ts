/* =========================
   Site Configuration
   Central config object for all external URLs,
   API endpoints, and social media links.
   Import SITE_CONFIG wherever external URLs are needed.
========================= */

import { appConfig } from "@/lib/appConfig";

export const SITE_CONFIG = {
  urls: {
    /** Base URL for the financing application iframe */
    financeBaseUrl: "https://www.cardora.ca/finance",

    /** API endpoint for the financing form render (postMessage height) */
    financeRenderApiUrl: "https://cardora.zopsoftware.com/api/templates/render/15",

    /** CDN base URL for vehicle images from Typesense */
    assetBaseUrl: appConfig.site.cdn_api,

    /** Google Maps link to the Cardora dealership */
    googleMapsUrl: appConfig.dealership.address_map_url_1 || appConfig.dealership.address_1_bar,
  },

  api: {
    /** SaaS API endpoint */
    saasApi: appConfig.site.saas_api,
    
    /** CDN API endpoint */
    cdnApi: appConfig.site.cdn_api,
  },

  inventory: {
    /** Default sort parameter for inventory */
    defaultSort: appConfig.site.default_sort,
    
    /** Collection ID for the inventory */
    collectionId: appConfig.site.collection,
    
    /** Inventory slug for URLs */
    slug: appConfig.site.inventory_slug,
    
    /** Pricing disclaimer text */
    pricingVerbage: appConfig.site.inventory_pricing_verbage,
  },

  typesense: {
    /** Typesense host */
    host: appConfig.site.typesense_host,
    
    /** Typesense port */
    port: appConfig.site.typesense_port,
    
    /** Typesense protocol */
    protocol: appConfig.site.typesense_protocol,
  },

  social: {
    facebook: appConfig.dealership.social_media_facebook,
    instagram: appConfig.dealership.social_media_instagram,
  },

  dealership: {
    /** Dealership name */
    name: appConfig.dealership.dealership_name,
    
    /** Dealership logo URL */
    logo: appConfig.dealership.dealership_logo,
    
    /** Default placeholder image for missing car images */
    placeholderImage: appConfig.dealership.default_placeholder_image,
  },
} as const;
