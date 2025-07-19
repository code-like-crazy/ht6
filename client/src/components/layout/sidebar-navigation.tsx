import { Home, Settings, Users, FolderOpen } from "lucide-react";

const SidebarNavigation = () => {
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: true,
    },
    {
      name: "Organizations",
      href: "/organizations",
      icon: FolderOpen,
      current: false,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderOpen,
      current: false,
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      current: false,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: false,
    },
  ];

  return (
    <nav className="flex-1 px-4 py-6">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                item.current
                  ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 hover:border-sidebar-border border border-transparent"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 transition-colors ${
                  item.current
                    ? "text-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                }`}
              />
              <span className="font-sans">{item.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
