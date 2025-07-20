"use client";

import { ExternalLink, BookOpen } from "lucide-react";

interface KnowledgeItem {
  title: string;
  type: string;
  source: string;
  lastUpdated: string;
}

interface KnowledgeTabProps {
  isDemo?: boolean;
  projectId?: number;
  items?: KnowledgeItem[];
}

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    title: "API Documentation",
    type: "documentation",
    source: "GitHub",
    lastUpdated: "2 hours ago",
  },
  {
    title: "Team Meeting Notes",
    type: "meeting",
    source: "Slack",
    lastUpdated: "1 day ago",
  },
  {
    title: "Design System",
    type: "design",
    source: "Figma",
    lastUpdated: "3 days ago",
  },
  {
    title: "Sprint Planning",
    type: "planning",
    source: "Linear",
    lastUpdated: "1 week ago",
  },
];

export default function KnowledgeTab({
  isDemo = true,
  projectId,
  items,
}: KnowledgeTabProps) {
  // TODO: Replace with actual data fetching when isDemo is false
  const knowledgeItems = isDemo ? items || mockKnowledgeItems : []; // In real implementation, fetch from database using projectId

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <BookOpen className="text-muted-foreground h-8 w-8" />
      </div>
      <h4 className="text-foreground mb-2 text-sm font-semibold">
        No knowledge base yet
      </h4>
      <p className="text-muted-foreground mb-4 text-xs">
        Connect your tools to automatically sync documentation, meeting notes,
        and other project knowledge.
      </p>
    </div>
  );

  if (knowledgeItems.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-semibold">
          Knowledge Base
        </h3>
        <span className="text-muted-foreground text-sm font-medium">
          {knowledgeItems.length} items
        </span>
      </div>

      {knowledgeItems.map((item, index) => (
        <div
          key={index}
          className="border-border/30 bg-background/50 hover:bg-background/70 cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-foreground text-sm font-semibold">
                {item.title}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {item.type} • {item.source}
              </p>
            </div>
            <ExternalLink className="text-muted-foreground h-4 w-4" />
          </div>
          <p className="text-muted-foreground mt-3 text-xs">
            Updated {item.lastUpdated}
          </p>
        </div>
      ))}
    </div>
  );
}
