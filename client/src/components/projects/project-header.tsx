"use client";

import { ProjectBreadcrumbs } from "@/components/shared/breadcrumbs";
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

      <div className="mt-4">
        <h1 className="text-foreground text-2xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-1 text-sm">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
}
