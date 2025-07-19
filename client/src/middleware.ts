import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip Auth0 middleware for custom login/callback routes to avoid JWE issues
  if (request.nextUrl.pathname.startsWith("/api/auth/custom-")) {
    return NextResponse.next();
  }

  // Skip middleware for theme-related requests and static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.includes("/favicon.ico") ||
    request.nextUrl.pathname.includes("/sitemap.xml") ||
    request.nextUrl.pathname.includes("/robots.txt") ||
    request.headers.get("sec-fetch-dest") === "script" ||
    request.headers.get("sec-fetch-dest") === "style"
  ) {
    return NextResponse.next();
  }

  // Check if we have a custom session cookie
  const customSession = request.cookies.get("appSession");

  if (customSession) {
    try {
      const sessionData = JSON.parse(customSession.value);
      // If we have a valid custom session, skip Auth0 middleware
      if (sessionData.user && sessionData.accessToken) {
        return NextResponse.next();
      }
    } catch (error) {
      // Invalid session cookie, let Auth0 handle it
    }
  }

  // Since we're using custom sessions, just continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
