"use client";

import { ProjectBreadcrumbs } from "./project-breadcrumbs";
import { ProjectWithOrganization } from "@/server/services/project";

interface ProjectHeaderProps {
  project: ProjectWithOrganization;
  availableProjects?: Array<{
    id: number;
    name: string;
    organizationId: number;
    organizationName: string;
  }>;
}

export default function ProjectHeader({
  project,
  availableProjects = [],
}: ProjectHeaderProps) {
  return (
    <div className="border-border/30 mb-6 border-b pb-4">
      <ProjectBreadcrumbs
        organizationName={project.organization.name}
        organizationId={project.organizationId}
        projectName={project.name}
        projectId={project.id}
        availableProjects={availableProjects}
      />
    </div>
  );
}
