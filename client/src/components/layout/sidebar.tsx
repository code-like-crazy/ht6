"use client";

import SidebarLogo from "./sidebar-logo";
import SidebarNavigation from "./sidebar-navigation";
import SidebarQuickActions from "./sidebar-quick-actions";
import SidebarUserProfile from "./sidebar-user-profile";
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

        {/* Quick Actions Section */}
        <SidebarQuickActions isCollapsed={isCollapsed} showThemeToggle={true} />

        {/* User Profile Section */}
        <SidebarUserProfile isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
