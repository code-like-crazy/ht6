"use client";

import Sidebar from "@/components/layout/sidebar";
import MobileNavbar from "@/components/layout/mobile-navbar";
import { useSidebar } from "@/components/providers/sidebar-provider";

type Props = {
  children: React.ReactNode;
};

const DashboardContent = ({ children }: Props) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-svh">
      {/* Mobile Navbar - only visible on small screens */}
      <MobileNavbar />

      {/* Desktop Sidebar - hidden on small screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="bg-secondary flex flex-1 flex-col">
        <main
          className={`flex-1 overflow-y-auto pt-16 transition-[margin-left] duration-300 ease-in-out lg:pt-0 ${
            isCollapsed ? "lg:ml-14" : "lg:ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardContent;
