export const dynamic = 'force-dynamic';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.cardora.ca/sitemap.xml`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
