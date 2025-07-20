"use client";

import { useState, useMemo } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { OrganizationWithRole } from "@/server/services/organization";
import ProjectsHeader from "@/components/projects/projects-header";
import ProjectsGrid from "@/components/projects/projects-grid";
import ProjectEmptyState from "@/components/projects/project-empty-state";
import CreateProjectModal from "@/components/projects/create-project-modal";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface ProjectsClientProps {
  organizations: OrganizationWithRole[];
  projects: ProjectWithOrganization[];
  user: User;
}

export default function ProjectsClient({
  organizations,
  projects,
  user,
}: ProjectsClientProps) {
  const [selectedOrganization, setSelectedOrganization] =
    useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter projects based on selected organization
  const filteredProjects = useMemo(() => {
    if (selectedOrganization === "all") {
      return projects;
    }
    return projects.filter(
      (project) => project.organizationId === parseInt(selectedOrganization),
    );
  }, [projects, selectedOrganization]);

  return (
    <div className="flex h-full w-full items-center justify-center p-2 sm:p-4 lg:min-h-svh">
      <div className="border-border/60 bg-background flex h-full w-full flex-col rounded-xl border-2 border-dashed p-4 sm:p-8">
        <ProjectsHeader
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          onOrganizationChange={setSelectedOrganization}
          onCreateProject={() => setIsCreateModalOpen(true)}
        />

        {filteredProjects.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <ProjectEmptyState
              selectedOrganization={selectedOrganization}
              organizations={organizations}
              onCreateProject={() => setIsCreateModalOpen(true)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <ProjectsGrid projects={filteredProjects} />
          </div>
        )}

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          user={user}
        />
      </div>
    </div>
  );
}
