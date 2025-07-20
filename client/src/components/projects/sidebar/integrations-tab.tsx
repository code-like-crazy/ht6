"use client";

import { Button } from "@/components/ui/button";
import { Plus, Plug } from "lucide-react";
import {
  availableIntegrations,
  mockConnectedIntegrations,
  integrationStatuses,
} from "@/config/integrations";
import { useIntegrationModal } from "@/components/providers/integration-modal-provider";

interface IntegrationsTabProps {
  isDemo?: boolean;
  projectId?: number;
}

export default function IntegrationsTab({
  isDemo = true,
  projectId,
}: IntegrationsTabProps) {
  const { openIntegrationModal } = useIntegrationModal();

  const handleAddIntegration = () => {
    if (projectId) {
      openIntegrationModal(projectId);
    }
  };
  // TODO: Replace with actual data fetching when isDemo is false
  const connectedIntegrations = isDemo
    ? mockConnectedIntegrations.map((connected) => {
        const integration = availableIntegrations.find(
          (int) => int.id === connected.id,
        );
        return {
          ...integration!,
          ...connected,
        };
      })
    : []; // In real implementation, fetch from database using projectId

  const EmptyState = () => (
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
        onClick={handleAddIntegration}
      >
        <Plus className="mr-2 h-4 w-4" />
        Connect First Tool
      </Button>
    </div>
  );

  if (connectedIntegrations.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-semibold">
          Connected Tools
        </h3>
        <Button
          variant="outline"
          size="default"
          className="px-4 py-2"
          onClick={handleAddIntegration}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      {connectedIntegrations.map((integration) => {
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
              <p className="text-muted-foreground text-xs">
                Last sync: {integration.lastSync}
              </p>
              {integration.syncedItems > 0 && (
                <p className="text-muted-foreground text-xs">
                  {integration.syncedItems.toLocaleString()} items
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
