"use client";

import { Button } from "@/components/ui/button";
import {
  FolderPlus,
  Lightbulb,
  Users,
  Zap,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import { OrganizationWithRole } from "@/server/services/organization";

interface ProjectEmptyStateProps {
  selectedOrganization: string;
  organizations: OrganizationWithRole[];
  onCreateProject: () => void;
}

export default function ProjectEmptyState({
  selectedOrganization,
  organizations,
  onCreateProject,
}: ProjectEmptyStateProps) {
  const getEmptyStateMessage = () => {
    if (selectedOrganization === "all") {
      return {
        title: "No Projects Yet",
        description:
          "Create your first project to start organizing your team's knowledge and connect your development tools.",
        buttonText: "Create Your First Project",
      };
    }

    const selectedOrg = organizations.find(
      (org) => org.id === parseInt(selectedOrganization),
    );
    return {
      title: `No Projects in ${selectedOrg?.name || "Organization"}`,
      description: `Start building your knowledge base by creating a project in ${selectedOrg?.name || "this organization"}.`,
      buttonText: "Create Project",
    };
  };

  const { title, description, buttonText } = getEmptyStateMessage();

  return (
    <div className="max-w-4xl px-4 text-center">
      <div className="bg-primary/10 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full sm:mb-8 sm:h-16 sm:w-16">
        <FolderPlus className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
      </div>

      <h1 className="text-foreground mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
        {title}
      </h1>

      <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-sm leading-relaxed sm:mb-8 sm:text-base">
        {description}
      </p>

      <div className="mx-auto mb-6 grid max-w-3xl grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        <div className="bg-card/50 border-border rounded-lg border p-4 text-center shadow-md">
          <div className="bg-accent/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="text-accent h-5 w-5" />
          </div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            Team Knowledge
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Centralize conversations and decisions from all your tools
          </p>
        </div>

        <div className="bg-card/50 border-border rounded-lg border p-4 text-center shadow-md">
          <div className="bg-accent/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
            <GitBranch className="text-accent h-5 w-5" />
          </div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            Tool Integration
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Connect GitHub, Slack, Linear, Figma, and Notion
          </p>
        </div>

        <div className="bg-card/50 border-border rounded-lg border p-4 text-center shadow-md">
          <div className="bg-accent/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
            <MessageSquare className="text-accent h-5 w-5" />
          </div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            AI-Powered Answers
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Get instant answers with citations to original sources
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          size="default"
          className="px-6 py-2 text-sm"
          onClick={onCreateProject}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>

      <div className="border-border mt-8 border-t pt-6">
        <p className="text-muted-foreground text-xs">
          Need help getting started?{" "}
          <a
            href="#"
            className="text-primary font-medium transition-colors hover:underline"
          >
            View our project setup guide
          </a>{" "}
          or{" "}
          <a
            href="#"
            className="text-primary font-medium transition-colors hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
