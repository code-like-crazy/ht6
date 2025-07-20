import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/user";
import { db } from "@/server/db";
import { connectionsTable, embeddingsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { embedGithubRepoFiles } from "@/server/services/embed-github-repo";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubFile {
  path: string;
  content: string;
  size: number;
  encoding: string;
}

async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  accessToken: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      console.warn(`Failed to fetch ${path}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Handle file content (base64 encoded)
    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }

    return null;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    return null;
  }
}

async function getRepositoryFiles(
  owner: string,
  repo: string,
  accessToken: string,
): Promise<GitHubFile[]> {
  try {
    // Get repository info to find default branch
    const repoResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!repoResponse.ok) {
      throw new Error(
        `Failed to fetch repository info: ${repoResponse.status}`,
      );
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch || "main";

    // Get file tree
    const treeResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!treeResponse.ok) {
      throw new Error(`Failed to fetch file tree: ${treeResponse.status}`);
    }

    const treeData = await treeResponse.json();

    // Filter for text files we want to process
    const textFileExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".h",
      ".cs",
      ".php",
      ".rb",
      ".go",
      ".rs",
      ".swift",
      ".kt",
      ".scala",
      ".md",
      ".txt",
      ".json",
      ".yaml",
      ".yml",
      ".xml",
      ".html",
      ".css",
      ".scss",
      ".less",
      ".sql",
      ".sh",
      ".bash",
      ".dockerfile",
      ".gitignore",
      ".env.example",
    ];

    const textFiles = treeData.tree
      .filter((item: { type: string; size: number; path: string }) => {
        if (item.type !== "blob") return false;
        if (item.size > 100000) return false; // Skip files larger than 100KB

        const filename = item.path.toLowerCase().split("/").pop();

        return (
          textFileExtensions.some((ext) =>
            item.path.toLowerCase().endsWith(ext),
          ) ||
          filename === "readme" ||
          filename === "license" ||
          filename === "changelog" ||
          filename === "contributing" ||
          filename === "dockerfile" ||
          filename === "makefile"
        );
      })
      .slice(0, 50); // Limit to 50 files for initial sync

    // Fetch content for each file
    const files: GitHubFile[] = [];
    for (const file of textFiles) {
      const content = await fetchFileContent(
        owner,
        repo,
        file.path,
        accessToken,
      );
      if (content) {
        files.push({
          path: file.path,
          content,
          size: file.size,
          encoding: "utf-8",
        });
      }
    }

    return files;
  } catch (error) {
    console.error("Error getting repository files:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, repositoryId } = await req.json();

    if (!projectId || !repositoryId) {
      return NextResponse.json(
        { error: "Missing projectId or repositoryId" },
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

    if (!connection?.credentials) {
      return NextResponse.json(
        { error: "GitHub connection not found" },
        { status: 404 },
      );
    }

    const credentials = connection.credentials as {
      access_token?: string;
      username?: string;
    };

    if (!credentials.access_token) {
      return NextResponse.json(
        { error: "GitHub access token not found" },
        { status: 401 },
      );
    }

    // Get repository info from connection settings
    const settings = connection.settings as {
      repositories?: Array<{ id: number; name: string; full_name: string }>;
    };

    const repository = settings.repositories?.find(
      (repo) => repo.id === parseInt(repositoryId),
    );

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found in connection" },
        { status: 404 },
      );
    }

    const [owner, repo] = repository.full_name.split("/");

    // Clear existing embeddings for this repository
    await db
      .delete(embeddingsTable)
      .where(
        and(
          eq(embeddingsTable.projectId, parseInt(projectId)),
          eq(embeddingsTable.sourceType, "github"),
        ),
      );

    // Fetch repository files
    const files = await getRepositoryFiles(
      owner,
      repo,
      credentials.access_token,
    );

    // Create embeddings for the files
    await embedGithubRepoFiles({
      projectId: parseInt(projectId),
      files,
    });

    // Update connection with last sync time
    await db
      .update(connectionsTable)
      .set({
        settings: {
          ...settings,
          last_sync: new Date().toISOString(),
        },
        updatedAt: new Date(),
      })
      .where(eq(connectionsTable.id, connection.id));

    return NextResponse.json({
      success: true,
      filesProcessed: files.length,
      repository: repository.full_name,
      message: `Successfully synced ${files.length} files from ${repository.full_name}`,
    });
  } catch (error: unknown) {
    console.error("GitHub sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync repository" },
      { status: 500 },
    );
  }
}
