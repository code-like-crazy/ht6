"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganizationModals } from "@/components/providers/organization-modal-provider";

const SidebarQuickActions = () => {
  const { openCreateModal, openJoinModal } = useOrganizationModals();

  return (
    <div className="border-sidebar-border/50 space-y-3 border-t p-4">
      <div className="space-y-2">
        <Button
          className="w-full justify-start font-sans shadow-sm"
          size="default"
          onClick={openCreateModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
        <Button
          className="w-full justify-start font-sans"
          variant="outline"
          size="sm"
          onClick={openJoinModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Join Organization
        </Button>
      </div>
    </div>
  );
};

export default SidebarQuickActions;
