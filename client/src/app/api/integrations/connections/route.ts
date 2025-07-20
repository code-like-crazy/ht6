import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/server/services/user";

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

    // Verify user has access to this project
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add proper project access validation
    // For now, we'll fetch connections for the project

    const connections = await db
      .select({
        id: connectionsTable.id,
        type: connectionsTable.type,
        name: connectionsTable.name,
        settings: connectionsTable.settings,
        isActive: connectionsTable.isActive,
        createdAt: connectionsTable.createdAt,
        updatedAt: connectionsTable.updatedAt,
      })
      .from(connectionsTable)
      .where(eq(connectionsTable.projectId, parseInt(projectId)));

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 },
    );
  }
}
