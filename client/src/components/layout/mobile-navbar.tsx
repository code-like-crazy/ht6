"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Settings,
  Users,
  FolderOpen,
  MessageSquare,
  Plus,
  Menu,
  Building2,
} from "lucide-react";
import { useUser } from "@/components/providers/user-provider";

const MobileNavbar = () => {
  const { user, isLoading } = useUser();
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: true,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderOpen,
      current: false,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
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
    <div className="bg-background border-border fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b px-4 lg:hidden">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Building2 className="text-primary h-6 w-6" />
        <h1 className="text-foreground font-serif text-lg font-semibold">
          HT6
        </h1>
      </div>

      {/* Hamburger Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-screen p-6">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-left text-xl">Navigation</SheetTitle>
          </SheetHeader>

          {/* Navigation Items */}
          <nav className="space-y-3 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="border-border space-y-3 border-t pt-4">
            <Button className="w-full" size="default">
              <Plus className="mr-2 h-5 w-5" />
              Create Organization
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* User Profile */}
          <div className="border-border border-t pt-4">
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="bg-muted h-8 w-8 animate-pulse rounded-full"></div>
                <div className="flex-1">
                  <div className="bg-muted h-4 w-20 animate-pulse rounded"></div>
                  <div className="bg-muted mt-1 h-3 w-24 animate-pulse rounded"></div>
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
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                  <span className="text-muted-foreground text-sm font-medium">
                    ?
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">Guest</p>
                  <p className="text-muted-foreground text-xs">Not signed in</p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
