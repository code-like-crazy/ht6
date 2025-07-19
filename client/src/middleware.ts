import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth0 } from "./lib/auth0"; // Adjust path if your auth0 client is elsewhere

export async function middleware(request: NextRequest) {
  // Skip Auth0 middleware for custom login/callback routes to avoid JWE issues
  if (request.nextUrl.pathname.startsWith("/api/auth/custom-")) {
    return;
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

  return await auth0.middleware(request);
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
