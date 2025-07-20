"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { OrganizationWithRole } from "@/server/services/organization";

interface ProjectsHeaderProps {
  organizations: OrganizationWithRole[];
  selectedOrganization: string;
  onOrganizationChange: (value: string) => void;
  onCreateProject: () => void;
}

export default function ProjectsHeader({
  organizations,
  selectedOrganization,
  onOrganizationChange,
  onCreateProject,
}: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground text-sm">
          Manage your projects across organizations
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={selectedOrganization}
          onValueChange={onOrganizationChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id.toString()}>
                <div className="flex items-center gap-2">
                  {org.icon && <span className="text-sm">{org.icon}</span>}
                  <span>{org.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onCreateProject} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>
    </div>
  );
}
