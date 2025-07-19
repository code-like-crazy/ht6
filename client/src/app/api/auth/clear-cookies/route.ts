import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Clear all Auth0 related cookies
    const response = NextResponse.redirect(new URL("/login", req.url));

    // Clear the main Auth0 session cookie
    response.cookies.set("appSession", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    // Clear any other potential Auth0 cookies
    response.cookies.set("auth0.is.authenticated", "", {
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("auth0.csrf", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Clear cookies error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
