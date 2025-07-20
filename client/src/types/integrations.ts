export interface Connection {
  id: number;
  type: string;
  name: string;
  settings: {
    // GitHub settings
    repositories?: Array<{ id: number; name: string; full_name: string }>;
    sync_enabled?: boolean;
    last_sync?: string | null;
    // Slack settings
    channels?: number;
    lastSync?: string;
    selectedChannels?: string[];
    // Generic settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectedIntegration {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connectionType: string;
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSync: string;
  syncedItems: number;
  dbConnection: Connection;
}
