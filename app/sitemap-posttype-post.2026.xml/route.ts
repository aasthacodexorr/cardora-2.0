import { GET_SITEMAP_POSTS } from '@/sitemap/handlers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return GET_SITEMAP_POSTS();
}
