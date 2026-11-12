import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getBlogUrl, getBlogDomain } from "@/lib/wordpress";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";

  if (pathname === "/blogs" || pathname === "/blogs/") {
    return NextResponse.redirect(new URL(getBlogDomain(host)), 308);
  }

  if (pathname.startsWith("/blogs/")) {
    const slug = pathname.replace(/^\/blogs\/?/, "");
    return NextResponse.redirect(new URL(getBlogUrl(slug, host)), 308);
  }

  // Redirect legacy /used-cars-{city} or /used-car-{city} to /inventory/used-car-{city}
  const locationMatch = pathname.match(/^\/used-cars?-([a-z0-9-]+)\/?$/i);
  if (locationMatch) {
    const city = locationMatch[1].toLowerCase();
    const search = request.nextUrl.search || "";
    return NextResponse.redirect(new URL(`/inventory/used-car-${city}${search}`, request.url), 308);
  }
}

export const config = {
  matcher: ["/blogs", "/blogs/:path*", "/used-cars-:city*", "/used-car-:city*"],
};
