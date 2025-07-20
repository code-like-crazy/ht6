import { getCurrentUser } from "@/server/services/user";
import {
  getOrganizationBySlug,
  getOrganizationMembers,
  canCreateProjects,
} from "@/server/services/organization";
import { getProjectsByOrgId } from "@/server/services/project";
import { redirect, notFound } from "next/navigation";
import OrganizationDetailClient from "./organization-detail-client";

interface OrganizationDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const OrganizationDetailPage = async ({
  params,
}: OrganizationDetailPageProps) => {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const organization = await getOrganizationBySlug(slug, user.id);

  if (!organization) {
    notFound();
  }

  const [members, projects, canCreate] = await Promise.all([
    getOrganizationMembers(organization.id),
    getProjectsByOrgId(organization.id),
    canCreateProjects(organization.id, user.id),
  ]);

  // Convert Date objects to serializable format
  const serializedOrganization = {
    ...organization,
    createdAt: organization.createdAt,
  };

  const serializedMembers = members.map((member) => ({
    ...member,
    joinedAt: member.joinedAt,
  }));

  const serializedProjects = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));

  return (
    <OrganizationDetailClient
      organization={serializedOrganization}
      members={serializedMembers}
      projects={serializedProjects}
      currentUser={user}
      canCreateProjects={canCreate}
    />
  );
};

export default OrganizationDetailPage;
