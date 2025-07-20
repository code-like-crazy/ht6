"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";
import ProjectCard, {
  ProjectIntegration,
} from "@/components/projects/project-card";

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

interface ProjectsSectionProps {
  projects: ProjectWithOrganization[];
  canCreateProjects: boolean;
  onCreateProject: () => void;
  getProjectIntegrations?: (projectId: number) => ProjectIntegration[];
}

export default function ProjectsSection({
  projects,
  canCreateProjects,
  onCreateProject,
  getProjectIntegrations,
}: ProjectsSectionProps) {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Projects ({projects.length})
        </CardTitle>
        {canCreateProjects && (
          <Button onClick={onCreateProject} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="py-12 text-center">
            <FolderOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 font-medium">
              No projects yet
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {canCreateProjects
                ? "Create your first project to get started."
                : "No projects have been created in this organization yet."}
            </p>
            {canCreateProjects && (
              <Button
                onClick={onCreateProject}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const integrations = getProjectIntegrations?.(project.id) || [];

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  integrations={integrations}
                  showActions={true}
                  onSettingsClick={() => {
                    // Handle settings click
                    console.log("Settings clicked for project:", project.id);
                  }}
                  onClick={() => {
                    // Handle project click
                    console.log("Project clicked:", project.id);
                  }}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
