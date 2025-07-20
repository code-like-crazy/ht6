import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { getCurrentUser } from "@/server/services/user";
import { eq, and } from "drizzle-orm";

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Slack OAuth error:", error);
      return NextResponse.redirect(
        new URL("/dashboard?error=slack_oauth_denied", req.url),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/dashboard?error=slack_oauth_invalid", req.url),
      );
    }

    // Decode and validate state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return NextResponse.redirect(
        new URL("/dashboard?error=slack_oauth_invalid_state", req.url),
      );
    }

    const { projectId, timestamp } = stateData;

    // Check if state is not too old (5 minutes)
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      return NextResponse.redirect(
        new URL("/dashboard?error=slack_oauth_expired", req.url),
      );
    }

    // Get user session to verify they can access this project
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }

    if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
      return NextResponse.redirect(
        new URL("/dashboard?error=slack_oauth_config", req.url),
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      console.error("Slack token exchange error:", tokenData.error);
      return NextResponse.redirect(
        new URL("/dashboard?error=slack_token_exchange", req.url),
      );
    }

    // Get team info for connection name
    const teamInfoResponse = await fetch("https://slack.com/api/team.info", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const teamInfo = await teamInfoResponse.json();
    const teamName = teamInfo.ok ? teamInfo.team.name : "Slack Workspace";

    // Check if connection already exists
    const existingConnection = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.projectId, projectId),
          eq(connectionsTable.type, "slack"),
        ),
      )
      .limit(1);

    const credentials = {
      access_token: tokenData.access_token,
      team_id: tokenData.team.id,
      team_name: tokenData.team.name,
      bot_user_id: tokenData.bot_user_id,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
    };

    if (existingConnection.length > 0) {
      // Update existing connection
      await db
        .update(connectionsTable)
        .set({
          name: teamName,
          credentials,
          isActive: 1,
          updatedAt: new Date(),
        })
        .where(eq(connectionsTable.id, existingConnection[0].id));
    } else {
      // Create new connection
      await db.insert(connectionsTable).values({
        projectId,
        type: "slack",
        name: teamName,
        credentials,
        isActive: 1,
      });
    }

    // Redirect back to project with success
    return NextResponse.redirect(
      new URL(
        `/projects/${projectId}?tab=integrations&success=slack_connected`,
        req.url,
      ),
    );
  } catch (error) {
    console.error("Slack callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=slack_callback_error", req.url),
    );
  }
}
