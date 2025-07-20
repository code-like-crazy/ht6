"use client";

import { useState } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Share2,
  Trash2,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Plus,
  Github,
  Slack,
  Figma,
  Calendar,
  Users,
  Activity,
} from "lucide-react";

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

type SidebarTab = "integrations" | "knowledge" | "links" | "actions";

export default function ProjectSidebar({ project, user }: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("integrations");

  // Mock data - in real app this would come from props/API
  const integrations = [
    {
      name: "GitHub",
      icon: Github,
      status: "connected",
      description: "Main repository",
      lastSync: "2 hours ago",
    },
    {
      name: "Slack",
      icon: Slack,
      status: "connected",
      description: "Team workspace",
      lastSync: "1 hour ago",
    },
    {
      name: "Figma",
      icon: Figma,
      status: "disconnected",
      description: "Design files",
      lastSync: "Never",
    },
    {
      name: "Linear",
      icon: LinkIcon,
      status: "connected",
      description: "Issue tracking",
      lastSync: "30 minutes ago",
    },
  ];

  const knowledgeItems = [
    {
      title: "API Documentation",
      type: "documentation",
      source: "GitHub",
      lastUpdated: "2 hours ago",
    },
    {
      title: "Team Meeting Notes",
      type: "meeting",
      source: "Slack",
      lastUpdated: "1 day ago",
    },
    {
      title: "Design System",
      type: "design",
      source: "Figma",
      lastUpdated: "3 days ago",
    },
    {
      title: "Sprint Planning",
      type: "planning",
      source: "Linear",
      lastUpdated: "1 week ago",
    },
  ];

  const quickLinks = [
    {
      title: "GitHub Repository",
      url: "https://github.com/example/repo",
      icon: Github,
    },
    {
      title: "Slack Channel",
      url: "https://slack.com/channels/project",
      icon: Slack,
    },
    {
      title: "Figma Design",
      url: "https://figma.com/design/project",
      icon: Figma,
    },
    {
      title: "Linear Board",
      url: "https://linear.app/project",
      icon: LinkIcon,
    },
  ];

  const tabs = [
    { id: "integrations", label: "Integrations", icon: LinkIcon },
    { id: "knowledge", label: "Knowledge", icon: FileText },
    { id: "links", label: "Quick Links", icon: ExternalLink },
    { id: "actions", label: "Actions", icon: Settings },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case "integrations":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-base font-semibold">
                Connected Tools
              </h3>
              <Button variant="outline" size="default" className="px-4 py-2">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="border-border/60 bg-background/50 hover:bg-background/70 rounded-xl border p-4 transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                      <integration.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">
                        {integration.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        integration.status === "connected"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {integration.status}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Last sync: {integration.lastSync}
                </p>
              </div>
            ))}
          </div>
        );

      case "knowledge":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-base font-semibold">
                Knowledge Base
              </h3>
              <span className="text-muted-foreground text-sm font-medium">
                {knowledgeItems.length} items
              </span>
            </div>
            {knowledgeItems.map((item, index) => (
              <div
                key={index}
                className="border-border/30 bg-background/50 hover:bg-background/70 cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-semibold">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {item.type} • {item.source}
                    </p>
                  </div>
                  <ExternalLink className="text-muted-foreground h-4 w-4" />
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Updated {item.lastUpdated}
                </p>
              </div>
            ))}
          </div>
        );

      case "links":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-base font-semibold">
                Quick Access
              </h3>
              <Button variant="outline" size="default" className="px-4 py-2">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border/30 bg-background/50 hover:bg-background/70 flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm"
              >
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm font-semibold">
                    {link.title}
                  </p>
                </div>
                <ExternalLink className="text-muted-foreground h-4 w-4" />
              </a>
            ))}
          </div>
        );

      case "actions":
        return (
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-foreground mb-4 text-base font-semibold">
                  Project Settings
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-3 text-sm font-medium"
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Configure Project
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-3 text-sm font-medium"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Manage Team
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-3 text-sm font-medium"
                  >
                    <Activity className="mr-3 h-5 w-5" />
                    View Analytics
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-4 text-base font-semibold">
                  Sharing & Export
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-3 text-sm font-medium"
                  >
                    <Share2 className="mr-3 h-5 w-5" />
                    Share Project
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-3 text-sm font-medium"
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Project Info and Delete */}
            <div className="border-border/30 mt-6 space-y-4 border-t pt-6">
              <div>
                <h3 className="text-foreground mb-3 text-sm font-medium">
                  Project Info
                </h3>
                <div className="border-border/30 bg-background/50 space-y-3 rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Organization: {project.organization.name}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full justify-start px-4 py-3 text-sm font-medium"
              >
                <Trash2 className="mr-3 h-5 w-5" />
                Delete Project
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
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
