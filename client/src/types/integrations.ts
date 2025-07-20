export interface Connection {
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
