"use client";

import { useState, useEffect } from "react";
import {
  availableIntegrations,
  integrationStatuses,
} from "@/config/integrations";
import { Connection, ConnectedIntegration } from "@/types/integrations";

interface UseIntegrationsProps {
  projectId?: number;
  isDemo?: boolean;
}

export function useIntegrations({ projectId, isDemo }: UseIntegrationsProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch connections when component mounts or projectId changes
  useEffect(() => {
    if (projectId && !isDemo) {
      fetchConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const connectedIntegrations: ConnectedIntegration[] = connections
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
      } else if (connection.type === "slack" && connection.settings) {
        syncedItems = connection.settings.channels || 0;
        if (connection.settings.lastSync) {
          lastSync = new Date(
            connection.settings.lastSync,
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

  return {
    connections,
    connectedIntegrations,
    isLoading,
    fetchConnections,
  };
}
