import {
  Settings,
  Share2,
  Trash2,
  FileText,
  ExternalLink,
  Plus,
  Users,
  Activity,
  Calendar,
} from "lucide-react";

export const projectTabs = [
  { id: "integrations", label: "Integrations", icon: ExternalLink },
  { id: "knowledge", label: "Knowledge", icon: FileText },
  { id: "links", label: "Quick Links", icon: ExternalLink },
  { id: "actions", label: "Actions", icon: Settings },
] as const;

export const projectActions = {
  settings: [
    { id: "configure", label: "Configure Project", icon: Settings },
    { id: "team", label: "Manage Team", icon: Users },
    { id: "analytics", label: "View Analytics", icon: Activity },
  ],
  sharing: [
    { id: "share", label: "Share Project", icon: Share2 },
    { id: "export", label: "Export Data", icon: FileText },
  ],
  danger: [{ id: "delete", label: "Delete Project", icon: Trash2 }],
} as const;

export const projectInfoItems = [
  {
    id: "created",
    icon: Calendar,
    getLabel: (date: string) =>
      `Created ${new Date(date).toLocaleDateString()}`,
  },
  {
    id: "organization",
    icon: Users,
    getLabel: (orgName: string) => `Organization: ${orgName}`,
  },
] as const;

export type ProjectTab = (typeof projectTabs)[number]["id"];
export type ProjectAction = keyof typeof projectActions;
