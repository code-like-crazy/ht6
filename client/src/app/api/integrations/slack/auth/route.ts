import { NextRequest, NextResponse } from "next/server";

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_REDIRECT_URI =
  process.env.SLACK_REDIRECT_URI ||
  `${process.env.AUTH0_BASE_URL}/api/integrations/slack/callback`;

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

    if (!SLACK_CLIENT_ID) {
      return NextResponse.json(
        { error: "Slack OAuth not configured" },
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

    // Slack OAuth URL with required scopes
    const authUrl = new URL("https://slack.com/oauth/v2/authorize");
    authUrl.searchParams.set("client_id", SLACK_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", SLACK_REDIRECT_URI);
    authUrl.searchParams.set(
      "scope",
      "channels:read channels:history groups:read groups:history im:read im:history mpim:read mpim:history users:read files:read",
    );
    authUrl.searchParams.set("user_scope", "");
    authUrl.searchParams.set("state", state);

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("Slack auth error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Slack OAuth" },
      { status: 500 },
    );
  }
}
