import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { integrationStatuses } from "@/config/integrations";
import { Connection, ConnectedIntegration } from "@/types/integrations";

interface IntegrationCardProps {
  integration: ConnectedIntegration;
  onConfigure: (connection: Connection) => void;
}

export function IntegrationCard({
  integration,
  onConfigure,
}: IntegrationCardProps) {
  const statusConfig = integrationStatuses[integration.status];

  return (
    <div
      key={integration.id}
      className="border-border/60 bg-background/50 hover:bg-background/70 rounded-xl border p-4 transition-all hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <integration.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {integration.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {integration.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
          >
            {statusConfig.label}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-xs">
            {integration.syncedItems > 0
              ? `${integration.syncedItems.toLocaleString()} connection(s)}`
              : "No connections yet"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onConfigure(integration.dbConnection)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
