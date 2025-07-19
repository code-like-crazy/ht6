import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");

    if (!provider || !["google", "github"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid or missing provider" },
        { status: 400 },
      );
    }

    // Redirect to Auth0 with the specified connection
    const connectionMap = {
      google: "google-oauth2",
      github: "github",
    };

    const connection = connectionMap[provider as keyof typeof connectionMap];
    const loginUrl = `/auth/login?connection=${connection}`;

    return NextResponse.redirect(new URL(loginUrl, req.url));
  } catch (error) {
    console.error("Social login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
