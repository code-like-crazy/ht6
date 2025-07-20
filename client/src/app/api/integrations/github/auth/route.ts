import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  `${process.env.AUTH0_BASE_URL}/api/integrations/github/callback`;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    if (!GITHUB_CLIENT_ID) {
      return NextResponse.json(
        { error: "GitHub OAuth not configured" },
        { status: 500 },
      );
    }

    // Generate a state parameter to prevent CSRF attacks
    const state = Buffer.from(
      JSON.stringify({
        projectId: parseInt(projectId),
        timestamp: Date.now(),
      }),
    ).toString("base64");

    // GitHub OAuth URL with required scopes
    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
    authUrl.searchParams.set("scope", "repo read:user user:email");
    authUrl.searchParams.set("state", state);

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("GitHub auth error:", error);
    return NextResponse.json(
      { error: "Failed to initiate GitHub OAuth" },
      { status: 500 },
    );
  }
}
