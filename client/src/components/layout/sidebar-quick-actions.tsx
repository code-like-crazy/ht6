import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarQuickActions = () => {
  return (
    <div className="border-sidebar-border/50 space-y-3 border-t p-4">
      <div className="space-y-2">
        <Button
          className="w-full justify-start font-sans shadow-sm"
          size="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
        <Button
          className="w-full justify-start font-sans"
          variant="outline"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
};

export default SidebarQuickActions;
