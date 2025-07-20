"use client";

import SidebarLogo from "./sidebar-logo";
import SidebarNavigation from "./sidebar-navigation";
import SidebarQuickActions from "./sidebar-quick-actions";
import SidebarUserProfile from "./sidebar-user-profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/providers/sidebar-provider";

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div
      className={`fixed top-0 left-0 z-40 hidden h-screen flex-col transition-[width] duration-300 ease-in-out lg:flex ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo/Brand Section */}
      <SidebarLogo isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Navigation Section */}
      <div className="flex flex-1 flex-col">
        <SidebarNavigation isCollapsed={isCollapsed} />

        {/* Theme Toggle */}
        <div
          className={`px-4 pb-4 ${isCollapsed ? "flex justify-center" : "ml-auto"}`}
        >
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Toggle theme</TooltipContent>
            </Tooltip>
          ) : (
            <ThemeToggle />
          )}
        </div>

        {/* Quick Actions Section */}
        <SidebarQuickActions isCollapsed={isCollapsed} />

        {/* User Profile Section */}
        <SidebarUserProfile isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
