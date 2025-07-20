"use client";

import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import { availableIntegrations } from "@/config/integrations";

interface QuickLink {
  title: string;
  url: string;
  integrationId: string;
}

interface QuickLinksTabProps {
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
  links = mockQuickLinks,
  onAddLink,
}: QuickLinksTabProps) {
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

      {links.map((link, index) => {
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
