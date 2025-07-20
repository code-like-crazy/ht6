import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/server/services/user";

const GITHUB_API_BASE = "https://api.github.com";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const path = searchParams.get("path");
    const projectId = searchParams.get("projectId");

    if (!owner || !repo || !path || !projectId) {
      return NextResponse.json(
        { error: "Missing required parameters: owner, repo, path, projectId" },
        { status: 400 },
      );
    }

    // Verify user has access and get GitHub connection
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get GitHub connection for this project
    const [connection] = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.projectId, parseInt(projectId)),
          eq(connectionsTable.type, "github"),
          eq(connectionsTable.isActive, 1),
        ),
      )
      .limit(1);

    if (!connection?.credentials) {
      return NextResponse.json(
        { error: "GitHub connection not found" },
        { status: 404 },
      );
    }

    const credentials = connection.credentials as {
      access_token?: string;
      username?: string;
      user_id?: number;
      avatar_url?: string;
      scopes?: string[];
    };

    if (!credentials.access_token) {
      return NextResponse.json(
        { error: "GitHub access token not found" },
        { status: 401 },
      );
    }

    const headers = {
      Authorization: `Bearer ${credentials.access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Fetch file content
    const fileRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      { headers },
    );

    if (!fileRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file from GitHub" },
        { status: fileRes.status },
      );
    }

    const fileData = await fileRes.json();

    // GitHub returns base64 encoded content for files
    if (fileData.content && fileData.encoding === "base64") {
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");

      return NextResponse.json({
        path: fileData.path,
        name: fileData.name,
        size: fileData.size,
        content,
        sha: fileData.sha,
        url: fileData.html_url,
        download_url: fileData.download_url,
      });
    }

    return NextResponse.json(
      { error: "File content not available or not a text file" },
      { status: 400 },
    );
  } catch (error) {
    console.error("GitHub file fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file content" },
      { status: 500 },
    );
  }
}
