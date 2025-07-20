import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { getCurrentUser } from "@/server/services/user";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/projects?error=github_oauth_denied`, req.url),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL(`/projects?error=github_oauth_invalid`, req.url),
      );
    }

    // Verify and decode state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return NextResponse.redirect(
        new URL(`/projects?error=github_oauth_invalid_state`, req.url),
      );
    }

    const { projectId } = stateData;

    if (!projectId) {
      return NextResponse.redirect(
        new URL(`/projects?error=github_oauth_missing_project`, req.url),
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(`/projects?error=github_token_exchange_failed`, req.url),
      );
    }

    const { access_token } = tokenData;

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    const userData = await userResponse.json();

    if (!userData.login) {
      return NextResponse.redirect(
        new URL(`/projects?error=github_user_fetch_failed`, req.url),
      );
    }

    // Get user session to verify they can access this project
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }

    // Store the connection in the database
    await db.insert(connectionsTable).values({
      projectId,
      type: "github",
      name: `GitHub - ${userData.login}`,
      credentials: {
        access_token,
        username: userData.login,
        user_id: userData.id,
        avatar_url: userData.avatar_url,
        scopes: tokenData.scope?.split(",") || [],
      },
      settings: {
        repositories: [], // Will be populated when user selects repos
        sync_enabled: true,
        last_sync: null,
      },
      isActive: 1,
    });

    // Redirect back to the project page with success
    return NextResponse.redirect(
      new URL(`/projects/${projectId}?success=github_connected`, req.url),
    );
  } catch (error) {
    console.error("GitHub callback error:", error);
    return NextResponse.redirect(
      new URL(`/projects?error=github_connection_failed`, req.url),
    );
  }
}
