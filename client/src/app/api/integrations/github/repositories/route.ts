import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/server/services/user";

const GITHUB_API_BASE = "https://api.github.com";

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

    // Fetch user's repositories (limit to 30 for better UX)
    const reposRes = await fetch(
      `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=30`,
      { headers },
    );

    if (!reposRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repositories from GitHub" },
        { status: reposRes.status },
      );
    }

    const repositories = await reposRes.json();

    // Format repository data
    const formattedRepos = repositories.map(
      (repo: {
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        private: boolean;
        html_url: string;
        clone_url: string;
        ssh_url: string;
        default_branch: string;
        language: string | null;
        stargazers_count: number;
        forks_count: number;
        size: number;
        updated_at: string;
        created_at: string;
        owner: {
          login: string;
          avatar_url: string;
        };
      }) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        default_branch: repo.default_branch,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        size: repo.size,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
        },
      }),
    );

    // Get currently selected repositories from connection settings
    const settings = connection.settings as {
      repositories?: Array<{ id: number; name: string; full_name: string }>;
      sync_enabled?: boolean;
      last_sync?: string | null;
    };

    const selectedRepoIds = settings.repositories?.map((r) => r.id) || [];

    return NextResponse.json({
      repositories: formattedRepos,
      selectedRepositories: selectedRepoIds,
      connection: {
        id: connection.id,
        name: connection.name,
        username: credentials.username,
      },
    });
  } catch (error) {
    console.error("GitHub repositories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { repositoryIds } = body;

    if (!Array.isArray(repositoryIds)) {
      return NextResponse.json(
        { error: "Repository IDs must be an array" },
        { status: 400 },
      );
    }

    // Verify user has access
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

    if (!connection) {
      return NextResponse.json(
        { error: "GitHub connection not found" },
        { status: 404 },
      );
    }

    // If no repositories selected, just update with empty array
    if (repositoryIds.length === 0) {
      await db
        .update(connectionsTable)
        .set({
          settings: {
            repositories: [],
            sync_enabled: true,
            last_sync: null,
          },
          updatedAt: new Date(),
        })
        .where(eq(connectionsTable.id, connection.id));

      return NextResponse.json({ success: true, selectedCount: 0 });
    }

    // Fetch repository details from GitHub for selected repos
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

    // Fetch all user repositories to get details for selected ones
    const reposRes = await fetch(
      `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=30`,
      { headers },
    );

    if (!reposRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repositories from GitHub" },
        { status: reposRes.status },
      );
    }

    const allRepositories = await reposRes.json();

    // Filter to only selected repositories
    const selectedRepos = allRepositories
      .filter((repo: { id: number }) => repositoryIds.includes(repo.id))
      .map((repo: { id: number; name: string; full_name: string }) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
      }));

    // Update connection settings with selected repositories
    await db
      .update(connectionsTable)
      .set({
        settings: {
          repositories: selectedRepos,
          sync_enabled: true,
          last_sync: null,
        },
        updatedAt: new Date(),
      })
      .where(eq(connectionsTable.id, connection.id));

    return NextResponse.json({
      success: true,
      selectedCount: selectedRepos.length,
      repositories: selectedRepos,
    });
  } catch (error) {
    console.error("GitHub repository selection error:", error);
    return NextResponse.json(
      { error: "Failed to update repository selection" },
      { status: 500 },
    );
  }
}
