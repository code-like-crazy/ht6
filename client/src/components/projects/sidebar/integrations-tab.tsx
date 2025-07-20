"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Plug, Settings, Github } from "lucide-react";
import {
  availableIntegrations,
  integrationStatuses,
} from "@/config/integrations";
import { useIntegrationModal } from "@/components/providers/integration-modal-provider";
import GitHubRepositoryModal from "@/components/projects/github-repository-modal";

interface Connection {
  id: number;
  type: string;
  name: string;
  settings: {
    repositories?: Array<{ id: number; name: string; full_name: string }>;
    sync_enabled?: boolean;
    last_sync?: string | null;
  };
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationsTabProps {
  isDemo?: boolean;
  projectId?: number;
}

export default function IntegrationsTab({
  isDemo = false,
  projectId,
}: IntegrationsTabProps) {
  const { openIntegrationModal } = useIntegrationModal();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [githubRepoModalOpen, setGithubRepoModalOpen] = useState(false);
  const [selectedGithubConnection, setSelectedGithubConnection] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch connections when component mounts or projectId changes
  useEffect(() => {
    if (projectId && !isDemo) {
      fetchConnections();
    }
  }, [projectId, isDemo]);

  const fetchConnections = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/integrations/connections?projectId=${projectId}`,
      );

      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIntegration = () => {
    if (projectId) {
      openIntegrationModal(projectId);
    }
  };

  const handleConfigureIntegration = (connection: Connection) => {
    if (connection.type === "github") {
      setSelectedGithubConnection({
        id: connection.id,
        name: connection.name,
      });
      setGithubRepoModalOpen(true);
    }
  };

  const connectedIntegrations = connections
    .map((connection) => {
      const integration = availableIntegrations.find(
        (int) => int.id === connection.type,
      );

      if (!integration) return null;

      // Determine status based on connection data
      let status: keyof typeof integrationStatuses = "connected";
      let syncedItems = 0;
      let lastSync = "Never";

      if (connection.type === "github" && connection.settings) {
        syncedItems = connection.settings.repositories?.length || 0;
        if (connection.settings.last_sync) {
          lastSync = new Date(
            connection.settings.last_sync,
          ).toLocaleDateString();
        }

        if (syncedItems === 0) {
          status = "disconnected";
        }
      }

      return {
        ...integration,
        id: connection.id,
        connectionType: connection.type,
        status,
        lastSync,
        syncedItems,
        dbConnection: connection,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

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
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground text-xs">
                  Last sync: {integration.lastSync}
                </p>
                {integration.syncedItems > 0 && (
                  <p className="text-muted-foreground text-xs">
                    {integration.syncedItems.toLocaleString()} items
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() =>
                  handleConfigureIntegration(integration.dbConnection)
                }
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}

      {/* GitHub Repository Selection Modal */}
      {selectedGithubConnection && projectId && (
        <GitHubRepositoryModal
          isOpen={githubRepoModalOpen}
          onClose={() => {
            setGithubRepoModalOpen(false);
            setSelectedGithubConnection(null);
            // Refresh connections after modal closes
            fetchConnections();
          }}
          projectId={projectId}
          connectionName={selectedGithubConnection.name}
        />
      )}
    </div>
  );
}
