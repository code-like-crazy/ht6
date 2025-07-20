"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/shared/page-header";
import CreateProjectModal from "@/components/projects/create-project-modal";
import OrganizationOverview from "@/components/organizations/organization-overview";
import TeamMembersSection from "@/components/organizations/team-members-section";
import ProjectsSection from "@/components/organizations/projects-section";
import { getProjectIntegrations } from "@/lib/mock-integrations";

type OrganizationDetails = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  createdById: number;
  createdAt: Date;
  userRole: string;
};

type OrganizationMember = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  role: string;
  joinedAt: Date | null;
};

type ProjectWithOrganization = {
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

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
};

interface OrganizationDetailClientProps {
  organization: OrganizationDetails;
  members: OrganizationMember[];
  projects: ProjectWithOrganization[];
  currentUser: CurrentUser;
  canCreateProjects: boolean;
}

export default function OrganizationDetailClient({
  organization,
  members,
  projects,
  currentUser,
  canCreateProjects,
}: OrganizationDetailClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const actions = [];
  if (canCreateProjects) {
    actions.push({
      label: "Create Project",
      icon: Plus,
      onClick: () => setIsCreateModalOpen(true),
    });
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-2 sm:p-4 lg:min-h-svh">
      <div className="bg-background flex h-full w-full flex-col space-y-6 rounded-xl p-4 sm:p-8 md:space-y-8">
        <PageHeader
          title={organization.name}
          description={
            organization.description ||
            "Manage projects, members, and collaborate with your team."
          }
          actions={actions}
        />

        {/* Organization Overview */}
        <OrganizationOverview
          organization={organization}
          memberCount={members.length}
          projectCount={projects.length}
        />

        {/* Team Members Section */}
        <TeamMembersSection
          members={members}
          currentUser={currentUser}
          organizationId={organization.id}
          organizationName={organization.name}
        />

        {/* Projects Section */}
        <ProjectsSection
          projects={projects}
          canCreateProjects={canCreateProjects}
          onCreateProject={() => setIsCreateModalOpen(true)}
          getProjectIntegrations={getProjectIntegrations}
        />

        {canCreateProjects && (
          <CreateProjectModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            organizations={[
              {
                id: organization.id,
                name: organization.name,
                slug: organization.slug,
                description: organization.description,
                imageUrl: organization.imageUrl,
                icon: organization.icon,
                role: organization.userRole,
                createdAt: organization.createdAt,
              },
            ]}
            selectedOrganization={organization.id.toString()}
            user={currentUser}
          />
        )}
      </div>
    </div>
  );
}
