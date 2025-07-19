import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Clear the custom session cookie
    const response = NextResponse.redirect(new URL("/login", req.url));

    response.cookies.set("appSession", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Custom logout error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
