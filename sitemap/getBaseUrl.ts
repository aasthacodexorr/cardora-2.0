import { headers } from 'next/headers';

export async function getSitemapBaseUrl() {
  const headersList = await headers();
  const host = headersList.get('host') || 'www.cardora.ca';
  const forwardedProto = headersList.get('x-forwarded-proto');
  const isLocal =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
  const protocol = forwardedProto || (isLocal ? 'http' : 'https');
  return `${protocol}://${host}`;
}


