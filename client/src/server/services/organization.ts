import "server-only";
import { db } from "@/server/db";
import {
  organizationsTable,
  organizationMembersTable,
} from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserOrganizations(userId: number) {
  const organizations = await db
    .select({
      id: organizationsTable.id,
      name: organizationsTable.name,
      slug: organizationsTable.slug,
      description: organizationsTable.description,
      imageUrl: organizationsTable.imageUrl,
      icon: organizationsTable.icon,
      role: organizationMembersTable.role,
      createdAt: organizationsTable.createdAt,
    })
    .from(organizationsTable)
    .innerJoin(
      organizationMembersTable,
      eq(organizationsTable.id, organizationMembersTable.organizationId),
    )
    .where(eq(organizationMembersTable.userId, userId));

  return organizations;
}

export async function getOrganizationById(
  organizationId: number,
  userId: number,
) {
  const [organization] = await db
    .select({
      id: organizationsTable.id,
      name: organizationsTable.name,
      slug: organizationsTable.slug,
      description: organizationsTable.description,
      imageUrl: organizationsTable.imageUrl,
      createdById: organizationsTable.createdById,
      role: organizationMembersTable.role,
      createdAt: organizationsTable.createdAt,
    })
    .from(organizationsTable)
    .innerJoin(
      organizationMembersTable,
      eq(organizationsTable.id, organizationMembersTable.organizationId),
    )
    .where(
      and(
        eq(organizationsTable.id, organizationId),
        eq(organizationMembersTable.userId, userId),
      ),
    );

  return organization;
}

export async function createOrganization(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdById: number;
}) {
  const [organization] = await db
    .insert(organizationsTable)
    .values(data)
    .returning();

  // Add the creator as an owner
  await db.insert(organizationMembersTable).values({
    organizationId: organization.id,
    userId: data.createdById,
    role: "owner",
    joinedAt: new Date(),
  });

  return organization;
}

export async function getUserRole(organizationId: number, userId: number) {
  const [member] = await db
    .select({
      role: organizationMembersTable.role,
    })
    .from(organizationMembersTable)
    .where(
      and(
        eq(organizationMembersTable.organizationId, organizationId),
        eq(organizationMembersTable.userId, userId),
      ),
    );

  return member?.role;
}

export async function canCreateProjects(
  organizationId: number,
  userId: number,
) {
  const role = await getUserRole(organizationId, userId);
  return role === "owner" || role === "manager";
}
