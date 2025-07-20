import "server-only";

import { db } from "@/server/db";
import {
  projectsTable,
  organizationsTable,
  organizationMembersTable,
} from "@/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export type CreateProjectData = {
  name: string;
  description?: string;
  organizationId: number;
  createdById: number;
};

export type ProjectWithOrganization = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  organizationId: number;
  createdById: number;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  organization: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    icon: string | null;
  };
};

/**
 * Get all projects for a specific organization
 */
export async function getProjectsByOrgId(
  organizationId: number,
): Promise<ProjectWithOrganization[]> {
  const projects = await db
    .select({
      id: projectsTable.id,
      name: projectsTable.name,
      slug: projectsTable.slug,
      description: projectsTable.description,
      organizationId: projectsTable.organizationId,
      createdById: projectsTable.createdById,
      settings: projectsTable.settings,
      createdAt: projectsTable.createdAt,
      updatedAt: projectsTable.updatedAt,
      organization: {
        id: organizationsTable.id,
        name: organizationsTable.name,
        slug: organizationsTable.slug,
        description: organizationsTable.description,
        imageUrl: organizationsTable.imageUrl,
        icon: organizationsTable.icon,
      },
    })
    .from(projectsTable)
    .innerJoin(
      organizationsTable,
      eq(projectsTable.organizationId, organizationsTable.id),
    )
    .where(eq(projectsTable.organizationId, organizationId))
    .orderBy(projectsTable.createdAt);

  return projects as ProjectWithOrganization[];
}

/**
 * Get all projects across all organizations a user belongs to
 */
export async function getProjectsByUser(
  userId: number,
): Promise<ProjectWithOrganization[]> {
  // First get all organization IDs the user is a member of
  const userOrganizations = await db
    .select({ organizationId: organizationMembersTable.organizationId })
    .from(organizationMembersTable)
    .where(eq(organizationMembersTable.userId, userId));

  if (userOrganizations.length === 0) {
    return [];
  }

  const organizationIds = userOrganizations.map((org) => org.organizationId);

  // Get all projects from those organizations
  const projects = await db
    .select({
      id: projectsTable.id,
      name: projectsTable.name,
      slug: projectsTable.slug,
      description: projectsTable.description,
      organizationId: projectsTable.organizationId,
      createdById: projectsTable.createdById,
      settings: projectsTable.settings,
      createdAt: projectsTable.createdAt,
      updatedAt: projectsTable.updatedAt,
      organization: {
        id: organizationsTable.id,
        name: organizationsTable.name,
        slug: organizationsTable.slug,
        description: organizationsTable.description,
        imageUrl: organizationsTable.imageUrl,
        icon: organizationsTable.icon,
      },
    })
    .from(projectsTable)
    .innerJoin(
      organizationsTable,
      eq(projectsTable.organizationId, organizationsTable.id),
    )
    .where(inArray(projectsTable.organizationId, organizationIds))
    .orderBy(projectsTable.createdAt);

  return projects as ProjectWithOrganization[];
}

/**
 * Create a new project
 */
export async function createProject(
  data: CreateProjectData,
): Promise<ProjectWithOrganization> {
  // First verify the user is a member of the organization
  const membership = await db
    .select()
    .from(organizationMembersTable)
    .where(
      and(
        eq(organizationMembersTable.organizationId, data.organizationId),
        eq(organizationMembersTable.userId, data.createdById),
      ),
    )
    .limit(1);

  if (membership.length === 0) {
    throw new Error("User is not a member of this organization");
  }

  // Generate a slug from the project name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Create the project
  const [newProject] = await db
    .insert(projectsTable)
    .values({
      name: data.name,
      slug,
      description: data.description || null,
      organizationId: data.organizationId,
      createdById: data.createdById,
    })
    .returning();

  // Fetch the project with organization details
  const [projectWithOrg] = await db
    .select({
      id: projectsTable.id,
      name: projectsTable.name,
      slug: projectsTable.slug,
      description: projectsTable.description,
      organizationId: projectsTable.organizationId,
      createdById: projectsTable.createdById,
      settings: projectsTable.settings,
      createdAt: projectsTable.createdAt,
      updatedAt: projectsTable.updatedAt,
      organization: {
        id: organizationsTable.id,
        name: organizationsTable.name,
        slug: organizationsTable.slug,
        description: organizationsTable.description,
        imageUrl: organizationsTable.imageUrl,
        icon: organizationsTable.icon,
      },
    })
    .from(projectsTable)
    .innerJoin(
      organizationsTable,
      eq(projectsTable.organizationId, organizationsTable.id),
    )
    .where(eq(projectsTable.id, newProject.id));

  return projectWithOrg as ProjectWithOrganization;
}

/**
 * Get a project by ID (with permission check)
 */
export async function getProjectById(
  projectId: number,
  userId: number,
): Promise<ProjectWithOrganization | null> {
  // Get the project with organization details
  const [project] = await db
    .select({
      id: projectsTable.id,
      name: projectsTable.name,
      slug: projectsTable.slug,
      description: projectsTable.description,
      organizationId: projectsTable.organizationId,
      createdById: projectsTable.createdById,
      settings: projectsTable.settings,
      createdAt: projectsTable.createdAt,
      updatedAt: projectsTable.updatedAt,
      organization: {
        id: organizationsTable.id,
        name: organizationsTable.name,
        slug: organizationsTable.slug,
        description: organizationsTable.description,
        imageUrl: organizationsTable.imageUrl,
        icon: organizationsTable.icon,
      },
    })
    .from(projectsTable)
    .innerJoin(
      organizationsTable,
      eq(projectsTable.organizationId, organizationsTable.id),
    )
    .where(eq(projectsTable.id, projectId));

  if (!project) {
    return null;
  }

  // Check if user is a member of the organization
  const membership = await db
    .select()
    .from(organizationMembersTable)
    .where(
      and(
        eq(organizationMembersTable.organizationId, project.organizationId),
        eq(organizationMembersTable.userId, userId),
      ),
    )
    .limit(1);

  if (membership.length === 0) {
    return null; // User doesn't have access to this project
  }

  return project as ProjectWithOrganization;
}
