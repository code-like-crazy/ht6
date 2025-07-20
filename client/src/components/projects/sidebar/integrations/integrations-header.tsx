import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IntegrationsHeaderProps {
  onAddIntegration: () => void;
}

export function IntegrationsHeader({
  onAddIntegration,
}: IntegrationsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-foreground text-base font-semibold">
        Connected Tools
      </h3>
      <Button
        variant="outline"
        size="default"
        className="px-4 py-2"
        onClick={onAddIntegration}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}
