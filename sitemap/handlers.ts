import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { INVENTORY_SITEMAP_API } from './config';
import { getSitemapBaseUrl } from './getBaseUrl';
import { buildIndexXml, buildUrlsetXml, xmlResponse } from './xml';

export async function GET_SITEMAP_INDEX() {
  const baseUrl = await getSitemapBaseUrl();
  return xmlResponse(buildIndexXml(baseUrl));
}

export async function GET_SITEMAP_PAGES() {
  const baseUrl = await getSitemapBaseUrl();
  return xmlResponse(buildUrlsetXml(baseUrl));
}

export async function GET_SITEMAP_POSTS() {
  const baseUrl = await getSitemapBaseUrl();
  return xmlResponse(buildUrlsetXml(baseUrl, []));
}

export async function GET_WEBSITE_SITEMAP() {
  try {
    const response = await fetch(INVENTORY_SITEMAP_API, { cache: 'no-store' });

    if (!response.ok) {
      return new Response('Failed to fetch sitemap', { status: 500 });
    }

    let xml = await response.text();
    const baseUrl = await getSitemapBaseUrl();
    const xslHeader = `<?xml-stylesheet type="text/xsl" href="${baseUrl}/sitemap.xsl"?>`;

    if (!xml.includes('xml-stylesheet')) {
      if (xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        xml = xml.replace(
          '<?xml version="1.0" encoding="UTF-8"?>',
          `<?xml version="1.0" encoding="UTF-8"?>\n${xslHeader}`
        );
      } else {
        xml = `${xslHeader}\n${xml}`;
      }
    }

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Website sitemap fetch error:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

export async function GET_SITEMAP_XSL() {
  const filePath = path.join(process.cwd(), 'sitemap', 'sitemap.xsl');
  const body = await readFile(filePath, 'utf8');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xslt+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
