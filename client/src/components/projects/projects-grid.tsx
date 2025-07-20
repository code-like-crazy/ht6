"use client";

import { ProjectWithOrganization } from "@/server/services/project";
import ProjectCard from "./project-card";

interface ProjectsGridProps {
  projects: ProjectWithOrganization[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
