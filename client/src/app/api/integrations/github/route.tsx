import { NextRequest, NextResponse } from "next/server";

type GitHubItem = {
  type: "pr" | "issue" | "commit";
  id: number | string;
  url: string;
  title?: string;
  author: string;
  created_at: string;
};

const GITHUB_API_BASE = "https://api.github.com";

// const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN!;

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner");
  const repo = req.nextUrl.searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
  }

  const headers = {
    // Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const results: GitHubItem[] = [];

  try {
    // Fetch Pull Requests
    const prRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=all&per_page=50`, { headers });
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
    const issueRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=50`, { headers });
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
    const commitRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=50`, { headers });
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

    return NextResponse.json({ data: results });
  } catch (error: any) {
    console.error("GitHub sync error:", error);
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 500 });
  }
}