import {
  Github,
  Slack,
  Figma,
  Link as LinkIcon,
  LucideIcon,
} from "lucide-react";

export interface Integration {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  category: "development" | "communication" | "design" | "project-management";
  authType: "oauth" | "api-key" | "webhook";
  features: string[];
}

export const availableIntegrations: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    description: "Connect repositories, issues, and pull requests",
    category: "development",
    authType: "oauth",
    features: [
      "repositories",
      "issues",
      "pull-requests",
      "comments",
      "commits",
    ],
  },
  {
    id: "slack",
    name: "Slack",
    icon: Slack,
    description: "Access team conversations and channels",
    category: "communication",
    authType: "oauth",
    features: ["channels", "messages", "threads", "files", "mentions"],
  },
  {
    id: "figma",
    name: "Figma",
    icon: Figma,
    description: "Import design files and comments",
    category: "design",
    authType: "api-key",
    features: ["files", "comments", "versions", "components", "styles"],
  },
  {
    id: "linear",
    name: "Linear",
    icon: LinkIcon,
    description: "Sync issues and project planning",
    category: "project-management",
    authType: "api-key",
    features: ["issues", "projects", "comments", "labels", "milestones"],
  },
];

export const integrationCategories = [
  { id: "development", label: "Development", color: "blue" },
  { id: "communication", label: "Communication", color: "green" },
  { id: "design", label: "Design", color: "purple" },
  { id: "project-management", label: "Project Management", color: "orange" },
] as const;

export const integrationStatuses = {
  connected: {
    label: "Connected",
    color: "green",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-800 dark:text-green-400",
  },
  disconnected: {
    label: "Disconnected",
    color: "red",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-800 dark:text-red-400",
  },
  syncing: {
    label: "Syncing",
    color: "yellow",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-800 dark:text-yellow-400",
  },
  error: {
    label: "Error",
    color: "red",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-800 dark:text-red-400",
  },
} as const;

export type IntegrationStatus = keyof typeof integrationStatuses;
export type IntegrationCategory = (typeof integrationCategories)[number]["id"];

// Mock data for connected integrations
export const mockConnectedIntegrations = [
  {
    id: "github",
    status: "connected" as IntegrationStatus,
    lastSync: "2 hours ago",
    syncedItems: 1247,
  },
  {
    id: "slack",
    status: "connected" as IntegrationStatus,
    lastSync: "1 hour ago",
    syncedItems: 3421,
  },
  {
    id: "figma",
    status: "disconnected" as IntegrationStatus,
    lastSync: "Never",
    syncedItems: 0,
  },
  {
    id: "linear",
    status: "connected" as IntegrationStatus,
    lastSync: "30 minutes ago",
    syncedItems: 156,
  },
];
