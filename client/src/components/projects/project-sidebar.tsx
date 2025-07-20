"use client";

import { useState } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { projectTabs, ProjectTab } from "@/config/projects";
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
