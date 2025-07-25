import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/server/services/user";

type GitHubItem = {
  type: "pr" | "issue" | "commit";
  id: number | string;
  url: string;
  title?: string;
  author: string;
  created_at: string;
};

const GITHUB_API_BASE = "https://api.github.com";

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner");
  const repo = req.nextUrl.searchParams.get("repo");
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 },
    );
  }

  // Verify user has access and get GitHub connection
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let accessToken = null;
  if (projectId) {
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

    if (connection?.credentials) {
      const credentials = connection.credentials as {
        access_token?: string;
        username?: string;
        user_id?: number;
        avatar_url?: string;
        scopes?: string[];
      };
      accessToken = credentials.access_token;
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const results: GitHubItem[] = [];

  try {
    // Fetch Pull Requests
    const prRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=all&per_page=50`,
      { headers },
    );
    const prs = await prRes.json();

    if (Array.isArray(prs)) {
      for (const pr of prs) {
        results.push({
          type: "pr",
          id: pr.id,
          url: pr.html_url,
          title: pr.title,
          author: pr.user?.login || "unknown",
          created_at: pr.created_at,
        });
      }
    }

    // Fetch Issues (excluding PRs)
    const issueRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=50`,
      { headers },
    );
    const issues = await issueRes.json();

    if (Array.isArray(issues)) {
      for (const issue of issues) {
        if (!issue.pull_request) {
          results.push({
            type: "issue",
            id: issue.id,
            url: issue.html_url,
            title: issue.title,
            author: issue.user?.login || "unknown",
            created_at: issue.created_at,
          });
        }
      }
    }

    // Fetch Commits
    const commitRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=50`,
      { headers },
    );
    const commits = await commitRes.json();

    if (Array.isArray(commits)) {
      for (const commit of commits) {
        results.push({
          type: "commit",
          id: commit.sha,
          url: commit.html_url,
          title: commit.commit?.message?.split("\n")[0] || "No commit message",
          author: commit.commit?.author?.name || "unknown",
          created_at: commit.commit?.author?.date,
        });
      }
    }

    // Get basic repository information
    const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers,
    });
    const repoData = await repoRes.json();

    // Get file tree structure (without downloading file contents)
    const branch = repoData.default_branch || "main";
    const treeRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers },
    );
    const treeData = await treeRes.json();

    let fileStructure: Array<{
      path: string;
      filename: string;
      size: number;
      url: string;
    }> = [];

    if (treeData.tree) {
      // Only return file paths and metadata, not contents
      fileStructure = treeData.tree
        .filter((item: { type: string }) => item.type === "blob")
        .slice(0, 100) // Limit to first 100 files for performance
        .map((file: { path: string; size: number; url: string }) => ({
          path: file.path,
          filename: file.path.split("/").pop() || "",
          size: file.size,
          url: file.url,
          // Don't fetch content here - do it on-demand when needed
        }));
    }

    return NextResponse.json({
      data: results,
      repository: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        defaultBranch: branch,
        language: repoData.language,
        stargazersCount: repoData.stargazers_count,
        forksCount: repoData.forks_count,
      },
      fileStructure,
    });
  } catch (error) {
    console.error("GitHub sync error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from GitHub" },
      { status: 500 },
    );
  }
}
