'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { useAppConfig } from '@/app/providers';
import {
  POPULAR_MAKES,
  POPULAR_CAR_TYPES,
  getMakeUrl,
  getInventoryUrlByRefinement
} from '@/lib/inventoryUrls';

interface SitemapUrl {
  loc: string;
  lastmod: string;
}

interface SitemapLink {
  label: string;
  url: string;
  lastmod?: string;
}

function extractVehicleTitle(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/^\/inventory\/([^/]+)/);

    if (!match) return '';

    const slug = match[1];
    const parts = slug.split('-');

    // Remove numeric ID if it exists
    const titleParts = parts.filter((part) => !/^\d+$/.test(part));

    if (!titleParts.length) return '';

    return titleParts
      .map(
        (part) =>
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join(' ');
  } catch {
    return '';
  }
}

function getInventoryListings(urls: SitemapUrl[]): SitemapLink[] {
  return urls
    .filter(({ loc }) => {
      try {
        const pathname = new URL(loc).pathname;

        return (
          pathname.startsWith('/inventory/') &&
          pathname !== '/inventory/' &&
          !loc.includes('?')
        );
      } catch {
        return false;
      }
    })
    .map(({ loc, lastmod }) => ({
      label: extractVehicleTitle(loc),
      url: loc,
      lastmod,
    }))
    .filter((item) => item.label)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function SitemapPage() {
  const appConfig = useAppConfig();
  const [inventoryListings, setInventoryListings] = useState<SitemapLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch('/api/sitemap', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sitemap');
        }

        const data = await response.json();
        const xmlText = data.xml;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
          throw new Error('Failed to parse XML');
        }

        const urls: SitemapUrl[] = [];
        const urlElements = xmlDoc.getElementsByTagName('url');

        for (let i = 0; i < urlElements.length; i++) {
          const locElement = urlElements[i].getElementsByTagName('loc')[0];
          const lastmodElement = urlElements[i].getElementsByTagName('lastmod')[0];

          if (locElement?.textContent) {
            urls.push({
              loc: locElement.textContent.trim(),
              lastmod: lastmodElement?.textContent?.trim() || '',
            });
          }
        }

        setInventoryListings(getInventoryListings(urls));
      } catch (err) {
        console.error('Sitemap error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load sitemap'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1300px] mx-auto px-4 lg:px-0 py-10 md:py-14 lg:mt-18">

          {/* Main H1 Page Heading */}
          <div className="mb-4">
            <h1 className="text-[28px] font-bold text-gray-900">
              Sitemap
            </h1>
          </div>

          <div className="space-y-12">

            {/* Top Inventory Links Section */}
            <section>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/inventory"
                  className="w-fit transition-colors hover:text-gray-600"
                >
                  <h2 className="text-[20px] font-semibold text-gray-900">Inventory</h2>
                </Link>

                <Link
                  href="/trade-in-my-car"
                  className="w-fit transition-colors hover:text-gray-600"
                >
                  <h2 className="text-[20px] font-semibold text-gray-900">Sell / Trade</h2>
                </Link>

                <Link
                  href="/financing"
                  className="w-fit transition-colors hover:text-gray-600"
                >
                  <h2 className="text-[20px] font-semibold text-gray-900">Finance</h2>
                </Link>

                <Link
                  href="/payment-calculator"
                  className="w-fit transition-colors hover:text-gray-600"
                >
                  <h2 className="text-[20px] font-semibold text-gray-900">Payment Calculator</h2>
                </Link>

                <Link
                  href="/skip-the-dealership"
                  className="w-fit transition-colors hover:text-gray-600"
                >
                  <h2 className="text-[20px] font-semibold text-gray-900">Skip the Dealership</h2>
                </Link>
              </div>
            </section>

            {/* Shop By Make */}
            <section>
              <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
                Shop by Make
              </h2>

              <div className="flex flex-col space-y-3">
                {POPULAR_MAKES.map((item) => (
                  <Link
                    key={item.make}
                    href={getMakeUrl(item.make, appConfig)}
                    className="text-lg text-brand-green hover:text-green-800 transition-colors w-fit"
                  >
                    <h3 className="font-normal text-lg">{item.label}</h3>
                  </Link>
                ))}
              </div>
            </section>

            {/* Shop By Car Type */}
            <section>
              <h2 className=" text-[20px] font-semibold text-gray-900 mb-6">
                Shop by Car Type
              </h2>

              <div className="flex flex-col space-y-3">
                {POPULAR_CAR_TYPES.map((item) => (
                  <Link
                    key={item.label}
                    href={getInventoryUrlByRefinement('body_type', item.bodyType, appConfig)}
                    className="text-lg text-brand-green hover:text-green-800 transition-colors w-fit"
                  >
                    <h3 className="font-normal text-lg">{item.label}</h3>
                  </Link>
                ))}
              </div>
            </section>

            {/* Shop By Inventory (Formerly Inventory Listings) */}
            <section>
              <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
                Shop by Inventory
              </h2>

              {loading && (
                <p className="text-lg text-gray-600">
                  Loading inventory...
                </p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 max-w-xl">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && inventoryListings.length > 0 && (
                <div className="flex flex-col space-y-3">
                  {inventoryListings.map((item, index) => (
                    <Link
                      key={`${item.url}-${index}`}
                      href={item.url}
                      className="text-lg text-brand-green hover:text-green-800 transition-colors w-fit"
                      title={
                        item.lastmod
                          ? `Updated: ${new Date(item.lastmod).toLocaleDateString()}`
                          : undefined
                      }
                    >
                      <h3 className="font-normal text-lg">{item.label}</h3>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && !error && inventoryListings.length === 0 && (
                <p className="text-lg text-gray-600">
                  No inventory listings found.
                </p>
              )}
            </section>

          </div>
        </div>
      </main>

      <GetInTouch />
      <Footer />
    </>
  );
}