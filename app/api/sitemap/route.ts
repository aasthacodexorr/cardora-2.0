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
      return Response.json(
        { error: 'Failed to fetch sitemap' },
        { status: 500 }
      );
    }

    const xml = await response.text();

    return Response.json({ xml });
  } catch (error) {
    console.error('Sitemap fetch error:', error);

    return Response.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}
