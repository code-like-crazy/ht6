"use client";

import { Plus, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganizationModals } from "@/components/providers/organization-modal-provider";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface SidebarQuickActionsProps {
  isCollapsed: boolean;
  showThemeToggle?: boolean;
}

const SidebarQuickActions = ({
  isCollapsed,
  showThemeToggle = false,
}: SidebarQuickActionsProps) => {
  const { openCreateModal, openJoinModal } = useOrganizationModals();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  if (isCollapsed) {
    return (
      <div className="border-sidebar-border/50 space-y-3 border-t p-4">
        <div className="space-y-2">
          {showThemeToggle && mounted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full justify-center font-sans"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTheme(
                      theme === "light"
                        ? "dark"
                        : theme === "dark"
                          ? "system"
                          : "light",
                    )
                  }
                >
                  {getThemeIcon(theme || "system")}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Switch to{" "}
                {theme === "light"
                  ? "Dark"
                  : theme === "dark"
                    ? "System"
                    : "Light"}{" "}
                theme
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full justify-center font-sans shadow-sm"
                size="sm"
                onClick={openCreateModal}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Create Organization</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full justify-center font-sans"
                variant="outline"
                size="sm"
                onClick={openJoinModal}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Join Organization</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="border-sidebar-border/50 space-y-3 border-t p-4">
      <div className="space-y-2">
        {showThemeToggle && mounted && (
          <div className="space-y-1">
            {/* <label className="text-muted-foreground text-xs font-medium">
              Theme
            </label> */}
            <Select value={theme || "system"} onValueChange={setTheme}>
              <SelectTrigger className="w-full font-sans">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getThemeIcon(theme || "system")}
                    <span>{getThemeLabel(theme || "system")}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <Button
          className="w-full justify-start font-sans shadow-sm"
          size="default"
          onClick={openCreateModal}
        >
          <Plus
            className={`h-4 w-4 shrink-0 transition-all duration-300 ${isCollapsed ? "" : "mr-3"}`}
          />
          <span
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Create Organization
          </span>
        </Button>
        <Button
          className="w-full justify-start font-sans"
          variant="outline"
          size="sm"
          onClick={openJoinModal}
        >
          <Plus
            className={`h-4 w-4 shrink-0 transition-all duration-300 ${isCollapsed ? "" : "mr-2"}`}
          />
          <span
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Join Organization
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarQuickActions;
