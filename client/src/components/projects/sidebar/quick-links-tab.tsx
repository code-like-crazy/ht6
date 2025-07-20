"use client";

import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Link } from "lucide-react";
import { availableIntegrations } from "@/config/integrations";

interface QuickLink {
  title: string;
  url: string;
  integrationId: string;
}

interface QuickLinksTabProps {
  isDemo?: boolean;
  projectId?: number;
  links?: QuickLink[];
  onAddLink?: () => void;
}

const mockQuickLinks: QuickLink[] = [
  {
    title: "GitHub Repository",
    url: "https://github.com/example/repo",
    integrationId: "github",
  },
  {
    title: "Slack Channel",
    url: "https://slack.com/channels/project",
    integrationId: "slack",
  },
  {
    title: "Figma Design",
    url: "https://figma.com/design/project",
    integrationId: "figma",
  },
  {
    title: "Linear Board",
    url: "https://linear.app/project",
    integrationId: "linear",
  },
];

export default function QuickLinksTab({
  isDemo = true,
  projectId,
  links,
  onAddLink,
}: QuickLinksTabProps) {
  // TODO: Replace with actual data fetching when isDemo is false
  const quickLinks = isDemo ? links || mockQuickLinks : []; // In real implementation, fetch from database using projectId

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Link className="text-muted-foreground h-8 w-8" />
      </div>
      <h4 className="text-foreground mb-2 text-sm font-semibold">
        No quick links added
      </h4>
      <p className="text-muted-foreground mb-4 text-xs">
        Add shortcuts to important project resources for quick access.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="px-4 py-2"
        onClick={onAddLink}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add First Link
      </Button>
    </div>
  );

  if (quickLinks.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-semibold">
          Quick Access
        </h3>
        <Button
          variant="outline"
          size="default"
          className="px-4 py-2"
          onClick={onAddLink}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      {quickLinks.map((link, index) => {
        const integration = availableIntegrations.find(
          (int) => int.id === link.integrationId,
        );
        const LinkIcon = integration?.icon || ExternalLink;

        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/30 bg-background/50 hover:bg-background/70 flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm"
          >
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <LinkIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-semibold">
                {link.title}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {link.url}
              </p>
            </div>
            <ExternalLink className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
