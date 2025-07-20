"use client";

import { ChevronRight, Home } from "lucide-react";
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

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
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
  projectName,
  projectId,
  availableProjects = [],
}: ProjectBreadcrumbsProps) {
  const otherProjects = availableProjects.filter((p) => p.id !== projectId);

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
          },
          {
            label: organizationName,
            href: `/organizations/${organizationId}`,
          },
          {
            label: projectName,
            current: true,
          },
        ]}
      />

      {otherProjects.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Switch Project
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Projects</h4>
              <div className="space-y-1">
                {otherProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="hover:bg-muted block rounded-md p-2 text-sm transition-colors"
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {project.organizationName}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
