import { SITEMAP_INDEX, SITE_PAGES } from './config';

export function xmlResponse(xml: string) {
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export function buildIndexXml(baseUrl: string) {
  const sitemaps = SITEMAP_INDEX.map(({ path, lastmod }) => {
    const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
    return `<sitemap><loc>${baseUrl}${path}</loc>${lastmodTag}</sitemap>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${baseUrl}/sitemap.xsl"?>
<!-- generated-on="${new Date().toISOString()}" -->
<!-- generator="XML Sitemap & Google News for WordPress" -->
<!-- generator-url="https://status301.net/wordpress-plugins/xml-sitemap-feed/" -->
<!-- generator-version="5.7.7" -->
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>
`;
}

export function buildUrlsetXml(baseUrl: string, paths: string[] = SITE_PAGES) {
  const urls = paths
    .map((path) => {
      const loc = path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`;
      return `  <url>
    <loc>${loc}</loc>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${baseUrl}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
