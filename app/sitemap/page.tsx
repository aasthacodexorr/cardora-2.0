'use client';

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { useEffect, useState } from 'react';

interface SitemapUrl {
  loc: string;
  lastmod: string;
}

interface SitemapGroup {
  title: string;
  links: Array<{
    label: string;
    url: string;
    lastmod: string;
  }>;
}

// Helper to extract vehicle title from URL slug
function extractVehicleTitle(urlPath: string): string {
  try {
    // Extract the slug part: e.g., "2024-volkswagen-jetta-comfortline-sport"
    const match = urlPath.match(/\/inventory\/([^/]+)/);
    if (!match) return '';

    const slug = match[1];
    // Split by dash and filter out the ID at the end
    const parts = slug.split('-');

    // Find where the ID starts (usually a numeric part at the end)
    let titleParts: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (/^\d+$/.test(parts[i]) && i === parts.length - 1) {
        break; // This is the ID, stop
      }
      titleParts.push(parts[i]);
    }

    if (titleParts.length === 0) return '';

    // Capitalize each word
    return titleParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  } catch {
    return '';
  }
}

// Helper to categorize URLs
function categorizeSitemapUrls(urls: SitemapUrl[]): SitemapGroup[] {
  const groups: Record<string, Array<{ label: string; url: string; lastmod: string }>> = {
    'Inventory Listings': [],
    'Shop by Style': [],
    'Shop by Make': [],
    'Resources': [],
  };

  urls.forEach(({ loc, lastmod }) => {
    if (loc.includes('/inventory/') && !loc.includes('?')) {
      // This is a vehicle detail page
      const title = extractVehicleTitle(loc);
      if (title) {
        groups['Inventory Listings'].push({
          label: title,
          url: loc,
          lastmod,
        });
      }
    } else if (loc.includes('/about-us') || loc.includes('/privacy-policy') ||
      loc.includes('/terms-conditions') || loc.includes('/contact-us')) {
      groups['Resources'].push({
        label: loc.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) || 'Page',
        url: loc,
        lastmod,
      });
    } else if (loc.includes('makes=') || loc.includes('body_type=')) {
      // Shop by make or style
      const isMake = loc.includes('makes=');
      const group = isMake ? 'Shop by Make' : 'Shop by Style';
      const params = new URLSearchParams(loc.split('?')[1]);
      const value = isMake ? params.get('makes') : params.get('body_type');
      if (value) {
        groups[group].push({
          label: value.split(',')[0].replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase()),
          url: loc,
          lastmod,
        });
      }
    } else if (loc !== 'https://www.cardora.ca/') {
      // Other pages
      groups['Resources'].push({
        label: loc.split('/').filter(Boolean).pop() || 'Home',
        url: loc,
        lastmod,
      });
    }
  });

  // Remove empty groups and maintain order
  return Object.entries(groups)
    .filter(([_, links]) => links.length > 0)
    .map(([title, links]) => ({
      title,
      links: links.sort((a, b) => a.label.localeCompare(b.label)),
    }));
}

export default function SitemapPage() {
  const [groups, setGroups] = useState<SitemapGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParseSitemap = async () => {
      try {
        // Fetch the XML sitemap from our server API
        const response = await fetch('/api/sitemap', { cache: 'no-store' });

        if (!response.ok) throw new Error('Failed to fetch sitemap');

        const data = await response.json();
        const xmlText = data.xml;

        // Parse XML
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
              loc: locElement.textContent,
              lastmod: lastmodElement?.textContent || '',
            });
          }
        }

        const categorized = categorizeSitemapUrls(urls);
        setGroups(categorized);
      } catch (err) {
        console.error('Sitemap error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sitemap');
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseSitemap();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Site Map</h1>
            <div className="text-center py-12">
              <p className="text-gray-600">Loading sitemap...</p>
            </div>
          </div>
        </div>
        <GetInTouch />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Site Map</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p>Error loading sitemap: {error}</p>
            </div>
          </div>
        </div>
        <GetInTouch />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 mt-18">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Site Map</h1>
            <p className="text-gray-600">Browse all pages and listings on Cardora</p>
          </div>

          {/* Sitemap Groups */}
          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group.title}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{group.title}</h2>

                {/* Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="text-brand-green hover:text-primary-greenLight hover:underline text-sm"
                      title={`Updated: ${new Date(link.lastmod).toLocaleDateString()}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total URLs indexed: <span className="font-semibold text-gray-900">
                {groups.reduce((sum, group) => sum + group.links.length, 0)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <GetInTouch />
      <Footer />
    </>
  );
}
