export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(
      'https://cardora.zopsoftware.com/api/website/sitemap',
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return new Response('Failed to fetch sitemap', { status: 500 });
    }

    const xml = await response.text();

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap XML fetch error:', error);

    return new Response('Failed to generate sitemap', { status: 500 });
  }
}
