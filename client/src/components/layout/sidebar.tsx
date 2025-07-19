"use client";

import { Home, Settings, Users, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers/user-provider";

const Sidebar = () => {
  const { user, isLoading } = useUser();
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
    <div className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col lg:flex">
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-sidebar-foreground font-serif text-xl font-semibold">
          HT6
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.current
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } `}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* Create Organization Button - More Prominent */}
      <div className="border-sidebar-border border-t p-4">
        <Button className="mb-3 w-full" size="default">
          <Plus className="mr-2 h-5 w-5" />
          Create Organization
        </Button>
        <Button className="w-full" variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* User Profile Section */}
      <div className="border-sidebar-border border-t p-4">
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="bg-sidebar-accent h-8 w-8 animate-pulse rounded-full"></div>
            <div className="min-w-0 flex-1">
              <div className="bg-sidebar-accent h-4 w-20 animate-pulse rounded"></div>
              <div className="bg-sidebar-accent mt-1 h-3 w-24 animate-pulse rounded"></div>
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center space-x-3">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-sidebar-primary flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-sidebar-primary-foreground text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate text-sm font-medium">
                {user.name}
              </p>
              <p className="text-sidebar-foreground/60 truncate text-xs">
                {user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="bg-sidebar-accent flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-sidebar-foreground text-sm font-medium">
                ?
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate text-sm font-medium">
                Guest
              </p>
              <p className="text-sidebar-foreground/60 truncate text-xs">
                Not signed in
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
