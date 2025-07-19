import SidebarLogo from "./sidebar-logo";
import SidebarNavigation from "./sidebar-navigation";
import SidebarQuickActions from "./sidebar-quick-actions";
import SidebarUserProfile from "./sidebar-user-profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Sidebar = () => {
  return (
    <div className="bg-sidebar border-sidebar-border fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r lg:flex">
      {/* Logo/Brand Section */}
      <SidebarLogo />

      {/* Navigation Section */}
      <div className="flex flex-1 flex-col">
        <SidebarNavigation />

        {/* Theme Toggle */}
        <div className="ml-auto px-4 pb-4">
          <ThemeToggle />
        </div>

        {/* Quick Actions Section */}
        <SidebarQuickActions />

        {/* User Profile Section */}
        <SidebarUserProfile />
      </div>
    </div>
  );
};

export default Sidebar;
