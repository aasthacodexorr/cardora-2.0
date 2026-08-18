import { GET_WEBSITE_SITEMAP } from '@/sitemap/handlers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return GET_WEBSITE_SITEMAP();
}
