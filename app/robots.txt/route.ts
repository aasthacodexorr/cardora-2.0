import { SITE_BASE_URL } from '@/sitemap/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_BASE_URL}/sitemap.xml`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

