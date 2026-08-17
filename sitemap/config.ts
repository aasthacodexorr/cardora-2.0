export type SitemapIndexItem = {
  path: string;
  lastmod?: string;
};

export const SITEMAP_INDEX: SitemapIndexItem[] = [
  {
    path: '/sitemap-posttype-post.2026.xml',
    lastmod: '2026-03-27T09:02:13+00:00',
  },
  {
    path: '/sitemap-posttype-page.xml',
    lastmod: '2026-06-03T13:37:25+00:00',
  },
  {
    path: '/website/sitemap',
  },
];

export const SITE_PAGES = [
  '/',
  '/about-us/',
  '/book-an-appointment/',
  '/contact-us/',
  '/faq/',
  '/finance/',
  '/financing/',
  '/how-it-works/',
  '/inventory/',
  '/payment-calculator/',
  '/privacy-policy/',
  '/protection-plans/',
  '/rebuild-your-credit/',
  '/schedule-an-appointment-with-expert/',
  '/service/',
  '/skip-the-dealership/',
  '/terms-conditions/',
  '/thank-you/',
  '/thank-you/complete-verification/',
  '/thank-you-finance/',
  '/thank-you-trade-in/',
  '/trade-in-my-car/',
  '/understanding-auto-financing/',
  '/what-do-i-need/',
];

export const INVENTORY_SITEMAP_API =
  'https://cardora.zopsoftware.com/api/website/sitemap';

export const SITEMAP_LOGO_SRC =
  'data:image/gif;base64,R0lGODlhUAAPAJEAAGZmZv////9mAImOeSwAAAAAUAAPAAACoISPqcvtD0+YtNqLs968myCE4kiW5jkGw8q27gvDwYfWdq3G+i7T9w/M8Ya7GQAUoiSTEyYSKYA2nSKhdXUdCIlaXzRVDVdB0+dS2lJZ1bkt0Sgti6NysvM5jbq2ai2WywJHYrZUaEhIWJXm99foNiRI9XUoV4g4GJjJyEgBGAkEivIIyPUZeppCqorlheo6ulr00UFba3uLEaG7y9urUAAAOw==';

export function formatSitemapLastmod(iso: string) {
  if (!iso) return '';
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)} (${iso.slice(19, 25)})`;
}
