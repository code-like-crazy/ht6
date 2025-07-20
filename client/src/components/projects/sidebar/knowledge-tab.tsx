"use client";

import { ExternalLink } from "lucide-react";

interface KnowledgeItem {
  title: string;
  type: string;
  source: string;
  lastUpdated: string;
}

interface KnowledgeTabProps {
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
  items = mockKnowledgeItems,
}: KnowledgeTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-semibold">
          Knowledge Base
        </h3>
        <span className="text-muted-foreground text-sm font-medium">
          {items.length} items
        </span>
      </div>

      {items.map((item, index) => (
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
