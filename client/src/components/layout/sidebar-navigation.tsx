"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navLinks } from "@/config/site";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/providers/sidebar-provider";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

const SidebarNavigation = ({ isCollapsed }: SidebarNavigationProps) => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="flex-1 px-4 py-6">
      <div className="space-y-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const linkContent = (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20 border shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                } ${isCollapsed ? "" : "mr-3"}`}
              />
              <span
                className={`overflow-hidden font-sans transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}

        {/* Expand Button - only show when collapsed */}
        {isCollapsed && (
          <div className="pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="hover:bg-sidebar-accent/50 h-12 w-full justify-center px-4 py-3"
                >
                  <PanelLeftOpen className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
