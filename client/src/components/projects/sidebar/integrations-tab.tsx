"use client";

import { useState } from "react";
import { useIntegrationModal } from "@/components/providers/integration-modal-provider";
import GitHubRepositoryModal from "@/components/projects/github-repository-modal";
import SlackChannelsModal from "@/components/projects/slack-channels-modal";
import { useIntegrations } from "@/hooks/use-integrations";
import { Connection } from "@/types/integrations";
import {
  EmptyState,
  LoadingState,
  IntegrationCard,
  IntegrationsHeader,
} from "./integrations";

interface IntegrationsTabProps {
  isDemo?: boolean;
  projectId?: number;
}

export default function IntegrationsTab({
  isDemo = false,
  projectId,
}: IntegrationsTabProps) {
  const { openIntegrationModal } = useIntegrationModal();
  const { connectedIntegrations, isLoading, fetchConnections } =
    useIntegrations({
      projectId,
      isDemo,
    });

  const [githubRepoModalOpen, setGithubRepoModalOpen] = useState(false);
  const [selectedGithubConnection, setSelectedGithubConnection] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [slackChannelsModalOpen, setSlackChannelsModalOpen] = useState(false);
  const [selectedSlackConnection, setSelectedSlackConnection] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
    } else if (connection.type === "slack") {
      setSelectedSlackConnection({
        id: connection.id,
        name: connection.name,
      });
      setSlackChannelsModalOpen(true);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (connectedIntegrations.length === 0) {
    return <EmptyState onAddIntegration={handleAddIntegration} />;
  }

  return (
    <div className="space-y-4">
      <IntegrationsHeader onAddIntegration={handleAddIntegration} />

      {connectedIntegrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onConfigure={handleConfigureIntegration}
        />
      ))}

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

      {/* Slack Channels Selection Modal */}
      {selectedSlackConnection && projectId && (
        <SlackChannelsModal
          isOpen={slackChannelsModalOpen}
          onClose={() => {
            setSlackChannelsModalOpen(false);
            setSelectedSlackConnection(null);
            // Refresh connections after modal closes
            fetchConnections();
          }}
          projectId={projectId}
          connectionName={selectedSlackConnection.name}
        />
      )}
    </div>
  );
}
