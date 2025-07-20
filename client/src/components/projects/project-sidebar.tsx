"use client";

import { useState } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { ProjectTab } from "@/config/projects";
import ProjectInfoSection from "./sidebar/project-info-section";
import TabNavigation from "./sidebar/tab-navigation";
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
  isDemo?: boolean;
}

export default function ProjectSidebar({
  project,
  user,
  isDemo = true,
}: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("integrations");

  const handleAction = (actionId: string) => {
    console.log(`Action triggered: ${actionId}`);
    // Handle different actions here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "integrations":
        return <IntegrationsTab isDemo={isDemo} projectId={project.id} />;
      case "knowledge":
        return <KnowledgeTab isDemo={isDemo} projectId={project.id} />;
      case "links":
        return (
          <QuickLinksTab
            isDemo={isDemo}
            projectId={project.id}
            onAddLink={() => console.log("Add link")}
          />
        );
      case "actions":
        return (
          <ActionsTab
            isDemo={isDemo}
            project={project}
            user={user}
            onAction={handleAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full max-h-svh flex-col">
      {/* Project Info Section */}
      <ProjectInfoSection project={project} user={user} />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <hr className="my-4" />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
}
