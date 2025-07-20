"use client";

import { useState } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { projectTabs, ProjectTab } from "@/config/projects";
import { Calendar, Users, Building } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import IntegrationsTab from "./sidebar/integrations-tab";
import KnowledgeTab from "./sidebar/knowledge-tab";
import QuickLinksTab from "./sidebar/quick-links-tab";
import ActionsTab from "./sidebar/actions-tab";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface ProjectSidebarProps {
  project: ProjectWithOrganization;
  user: User;
}

export default function ProjectSidebar({ project, user }: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("integrations");

  const handleAction = (actionId: string) => {
    console.log(`Action triggered: ${actionId}`);
    // Handle different actions here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "integrations":
        return (
          <IntegrationsTab
            onAddIntegration={() => console.log("Add integration")}
          />
        );
      case "knowledge":
        return <KnowledgeTab />;
      case "links":
        return <QuickLinksTab onAddLink={() => console.log("Add link")} />;
      case "actions":
        return (
          <ActionsTab project={project} user={user} onAction={handleAction} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Project Info Accordion */}
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

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-2">
        {projectTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-muted/50 hover:border-border border-border/50 border"
            }`}
          >
            <tab.icon
              className={`mr-3 h-5 w-5 transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-foreground/50 group-hover:text-foreground/70"
              }`}
            />
            <span className="font-sans">{tab.label}</span>
          </button>
        ))}
      </div>

      <hr className="my-4" />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
}
