export interface AISource {
  id: number;
  sourceType: string;
  sourceId: string;
  snippet: string;
  metadata: Record<string, unknown>;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  sources?: AISource[];
  metadata?: {
    projectName: string;
    chunksFound: number;
    connectionsAvailable: string[];
    timestamp: string;
  };
}

export interface QuickAction {
  label: string;
  icon: React.ElementType;
  prompt: string;
}
