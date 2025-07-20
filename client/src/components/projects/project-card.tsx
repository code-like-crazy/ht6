"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectWithOrganization } from "@/server/services/project";
import { Building2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectWithOrganization;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between">
          <span className="line-clamp-1 text-lg">{project.name}</span>
        </CardTitle>
        {project.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {project.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Building2 className="h-3 w-3" />
            <span className="flex items-center gap-1">
              {project.organization.icon && (
                <span className="text-xs">{project.organization.icon}</span>
              )}
              {project.organization.name}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3" />
            <span>
              Created {formatDistanceToNow(new Date(project.createdAt))} ago
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
