import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("access_token");
    const idToken = searchParams.get("id_token");
    const state = searchParams.get("state");

    if (!accessToken || !idToken) {
      return NextResponse.redirect(
        new URL("/login?error=missing_tokens", req.url),
      );
    }

    // Get user info from the access token
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const userResponse = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return NextResponse.redirect(
        new URL("/login?error=user_info_failed", req.url),
      );
    }

    console.log("Auth0 userinfo response:", userData);

    // Ensure the user data has the required fields
    if (!userData.sub) {
      console.error("Missing sub field in userinfo response:", userData);
      return NextResponse.redirect(
        new URL("/login?error=missing_sub", req.url),
      );
    }

    // Create a simple session cookie that mimics Auth0's format
    const sessionData = {
      user: {
        sub: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        ...userData, // Include any other fields
      },
      accessToken: accessToken,
      idToken: idToken,
      createdAt: Date.now(),
    };

    const response = NextResponse.redirect(new URL("/", req.url));

    // Set a simple session cookie (we'll handle encryption later if needed)
    response.cookies.set("appSession", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Custom callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", req.url),
    );
  }
}
