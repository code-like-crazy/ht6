"use client";

import { Button } from "@/components/ui/button";
import { ProjectWithOrganization } from "@/server/services/project";
import { projectActions, projectInfoItems } from "@/config/projects";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface ActionsTabProps {
  project: ProjectWithOrganization;
  user: User;
  onAction?: (actionId: string) => void;
}

export default function ActionsTab({
  project,
  user,
  onAction,
}: ActionsTabProps) {
  const handleAction = (actionId: string) => {
    if (onAction) {
      onAction(actionId);
    } else {
      console.log(`Action triggered: ${actionId}`);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6">
        {/* Project Settings */}
        <div>
          <h3 className="text-foreground mb-4 text-base font-semibold">
            Project Settings
          </h3>
          <div className="space-y-3">
            {projectActions.settings.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="w-full justify-start px-4 py-3 text-sm font-medium"
                onClick={() => handleAction(action.id)}
              >
                <action.icon className="mr-3 h-5 w-5" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sharing & Export */}
        <div>
          <h3 className="text-foreground mb-4 text-base font-semibold">
            Sharing & Export
          </h3>
          <div className="space-y-3">
            {projectActions.sharing.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="w-full justify-start px-4 py-3 text-sm font-medium"
                onClick={() => handleAction(action.id)}
              >
                <action.icon className="mr-3 h-5 w-5" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Project Info and Delete */}
      <div className="border-border/30 mt-6 space-y-4 border-t pt-6">
        <div>
          <h3 className="text-foreground mb-3 text-sm font-medium">
            Project Info
          </h3>
          <div className="border-border/30 bg-background/50 space-y-3 rounded-xl border p-4">
            {projectInfoItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <item.icon className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">
                  {item.id === "created"
                    ? item.getLabel(project.createdAt.toISOString())
                    : item.getLabel(project.organization.name)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        {projectActions.danger.map((action) => (
          <Button
            key={action.id}
            variant="destructive"
            className="w-full justify-start px-4 py-3 text-sm font-medium"
            onClick={() => handleAction(action.id)}
          >
            <action.icon className="mr-3 h-5 w-5" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
