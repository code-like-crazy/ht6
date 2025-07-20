"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { QuickAction } from "@/types/chat";
import QuickActions from "./quick-actions";

interface EmptyStateProps {
  projectName: string;
  quickActions: QuickAction[];
  onQuickActionClick: (prompt: string) => void;
}

export default function EmptyState({
  projectName,
  quickActions,
  onQuickActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <MessageSquare className="text-primary h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          Start a conversation
        </h3>
        <p className="text-muted-foreground max-w-md">
          Ask me anything about {projectName}. I have access to all your project
          data, conversations, and documentation.
        </p>
      </div>

      <QuickActions actions={quickActions} onActionClick={onQuickActionClick} />
    </div>
  );
}
