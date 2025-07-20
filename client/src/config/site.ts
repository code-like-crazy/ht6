import { Home, Settings, Users, FolderOpen } from "lucide-react";

export const siteConfig = {
  name: "Luminal",
  title: "Luminal - AI-Powered Team Knowledge Engine",
  description:
    "Transform scattered project context into instant, cited answers. Accelerate team onboarding with AI that understands your GitHub, Linear, Slack, Figma, and Notion.",
  url: "https://luminal.codelikecrazy.zdev",
};

export const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Organizations",
    href: "/organizations",
    icon: FolderOpen,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
