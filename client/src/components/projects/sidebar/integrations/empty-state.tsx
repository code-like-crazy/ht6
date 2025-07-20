import { Button } from "@/components/ui/button";
import { Plus, Plug } from "lucide-react";

interface EmptyStateProps {
  onAddIntegration: () => void;
}

export function EmptyState({ onAddIntegration }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Plug className="text-muted-foreground h-8 w-8" />
      </div>
      <h4 className="text-foreground mb-2 text-sm font-semibold">
        No integrations connected
      </h4>
      <p className="text-muted-foreground mb-4 text-xs">
        Connect your tools to start syncing project data and enable AI-powered
        insights.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="px-4 py-2"
        onClick={onAddIntegration}
      >
        <Plus className="mr-2 h-4 w-4" />
        Connect First Tool
      </Button>
    </div>
  );
}
