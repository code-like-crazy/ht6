import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="text-muted-foreground mb-4 h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading integrations...</p>
    </div>
  );
}
