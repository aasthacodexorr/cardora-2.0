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
}

export const config = {
  matcher: ["/blogs", "/blogs/:path*"],
};
