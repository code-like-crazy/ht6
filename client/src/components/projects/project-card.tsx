"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectWithOrganization } from "@/server/services/project";
import { Building2, Calendar, Settings } from "lucide-react";
import { formatDistanceToNow, getIconComponent } from "@/lib/utils";
import {
  availableIntegrations,
  IntegrationStatus,
} from "@/config/integrations";
import Link from "next/link";

export interface ProjectIntegration {
  id: string;
  status: IntegrationStatus;
}

interface ProjectCardProps {
  project: ProjectWithOrganization;
  integrations?: ProjectIntegration[];
  showActions?: boolean;
  onSettingsClick?: () => void;
}

export default function ProjectCard({
  project,
  integrations = [],
  showActions = false,
  onSettingsClick,
}: ProjectCardProps) {
  const connectedIntegrations = integrations.filter(
    (i) => i.status === "connected",
  );
  const IconComponent = getIconComponent(project.organization.icon);

  return (
    <Card className="group hover:border-primary/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between">
          <span className="line-clamp-1 text-lg">{project.name}</span>
          {showActions && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick?.();
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        {project.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {project.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <IconComponent className="size-3" />
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

          {integrations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  Integrations
                </span>
                <span className="text-muted-foreground text-xs">
                  {connectedIntegrations.length}/{integrations.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {integrations.map((integration) => {
                  const config = availableIntegrations.find(
                    (i) => i.id === integration.id,
                  );
                  if (!config) return null;

                  const IconComp = config.icon;
                  const isConnected = integration.status === "connected";

                  return (
                    <div
                      key={integration.id}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all ${
                        isConnected
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-muted/50 border-border text-muted-foreground"
                      }`}
                      title={`${config.name} ${isConnected ? "(Connected)" : "(Not connected)"}`}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button asChild className="mt-4 w-full">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
