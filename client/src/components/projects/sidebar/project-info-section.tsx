"use client";

import { ProjectWithOrganization } from "@/server/services/project";
import { Calendar, Users, Building } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface ProjectInfoSectionProps {
  project: ProjectWithOrganization;
  user: User;
}

export default function ProjectInfoSection({
  project,
  user,
}: ProjectInfoSectionProps) {
  return (
    <div className="mb-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="project-info" className="border-border/30">
          <AccordionTrigger className="px-0 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border">
                <span className="text-primary text-sm font-bold">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <h3 className="text-foreground text-sm font-semibold">
                  {project.name}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {project.organization.name}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0">
            <div className="space-y-3">
              {project.description && (
                <div>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Building className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {project.organization.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {user.name}
                  </span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
