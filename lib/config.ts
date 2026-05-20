/* =========================
   Site Configuration
   Central config object for all external URLs,
   API endpoints, and social media links.
   Import SITE_CONFIG wherever external URLs are needed.
========================= */

export const SITE_CONFIG = {
  urls: {
    /** Base URL for the financing application iframe */
    financeBaseUrl: "https://www.cardora.ca/finance",

    /** API endpoint for the financing form render (postMessage height) */
    financeRenderApiUrl: "https://cardora.zopsoftware.com/api/templates/render/15",

    /** CDN base URL for vehicle images from Typesense */
    assetBaseUrl: "https://zopsoftware-asset.b-cdn.net",

    /** Google Maps link to the Cardora dealership */
    googleMapsUrl:
      "https://www.google.com/maps/place/Cardora/@43.7019241,-79.7051392,1711m/data=!3m1!1e3!4m6!3m5!1s0x882b3f8957c9a033:0x9a07057d8dafccb0!8m2!3d43.7016063!4d-79.702997",
  },

  social: {
    facebook:  "https://facebook.com",
    instagram: "https://instagram.com",
  },
} as const;
