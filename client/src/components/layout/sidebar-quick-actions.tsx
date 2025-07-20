"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganizationModals } from "@/components/providers/organization-modal-provider";

interface SidebarQuickActionsProps {
  isCollapsed: boolean;
}

const SidebarQuickActions = ({ isCollapsed }: SidebarQuickActionsProps) => {
  const { openCreateModal, openJoinModal } = useOrganizationModals();

  if (isCollapsed) {
    return (
      <div className="border-sidebar-border/50 space-y-3 border-t p-4">
        <div className="space-y-2">
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
