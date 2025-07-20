"use client";

import { ChevronRight, Home, FolderOpen, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />
          )}

          {item.current ? (
            <span className="text-foreground flex items-center font-medium">
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </span>
          ) : item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-muted-foreground flex items-center">
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

interface ProjectBreadcrumbsProps {
  organizationName: string;
  organizationId: number;
  organizationSlug: string;
  projectName: string;
  projectId: number;
  availableProjects?: Array<{
    id: number;
    name: string;
    organizationId: number;
    organizationName: string;
  }>;
}

export function ProjectBreadcrumbs({
  organizationName,
  organizationId,
  organizationSlug,
  projectName,
  projectId,
  availableProjects = [],
}: ProjectBreadcrumbsProps) {
  // Include current project in the list
  const currentProject = {
    id: projectId,
    name: projectName,
    organizationId: organizationId,
    organizationName: organizationName,
  };

  const allProjects = [currentProject, ...availableProjects];
  const otherProjects = availableProjects.filter((p) => p.id !== projectId);

  // Group all projects (including current) by organization
  const projectsByOrg = allProjects.reduce(
    (acc, project) => {
      if (!acc[project.organizationName]) {
        acc[project.organizationName] = [];
      }
      acc[project.organizationName].push(project);
      return acc;
    },
    {} as Record<string, typeof allProjects>,
  );

  const totalProjectCount = allProjects.length;

  return (
    <div className="flex items-center justify-between">
      <Breadcrumbs
        items={[
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: Home,
          },
          {
            label: "Projects",
            href: "/projects",
            icon: FolderOpen,
          },
          {
            label: organizationName,
            href: `/org/${organizationSlug}`,
            icon: Building2,
          },
          {
            label: projectName,
            current: true,
          },
        ]}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Switch Project
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="border-border/50 bg-muted/30 border-b px-4 py-3">
            <h4 className="text-foreground text-sm font-semibold">
              Switch to Project
            </h4>
            <p className="text-muted-foreground text-xs">
              {totalProjectCount === 1
                ? "You have access to 1 project"
                : `Choose from ${totalProjectCount} available projects`}
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {Object.entries(projectsByOrg).map(([orgName, projects]) => (
              <div key={orgName} className="mb-4 last:mb-0">
                <div className="mb-2 flex items-center gap-2 px-2 py-1">
                  <Building2 className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {orgName}
                  </span>
                </div>

                <div className="space-y-1">
                  {projects.map((project) => {
                    const isCurrentProject = project.id === projectId;

                    return isCurrentProject ? (
                      <div
                        key={project.id}
                        className="bg-primary/5 border-primary/20 flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="bg-primary/10 border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border">
                          <span className="text-primary text-xs font-bold">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground truncate text-sm font-medium">
                            {project.name}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {project.organizationName}
                          </div>
                        </div>
                        <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                          Current
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-colors"
                      >
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                          <span className="text-muted-foreground text-xs font-bold">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground truncate text-sm font-medium">
                            {project.name}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {project.organizationName}
                          </div>
                        </div>
                        <ChevronRight className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
