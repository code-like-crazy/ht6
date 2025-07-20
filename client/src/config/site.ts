import { Home, Settings, Users, FolderOpen } from "lucide-react";

export const siteConfig = {
  title: "Loominal",
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
