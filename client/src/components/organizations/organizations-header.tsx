"use client";

import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

type OrganizationsHeaderProps = {
  onCreateClick: () => void;
  onJoinClick: () => void;
};

const OrganizationsHeader = ({
  onCreateClick,
  onJoinClick,
}: OrganizationsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Organizations
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your organizations and collaborate with your teams.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={onJoinClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Join Organization
        </Button>
        <Button onClick={onCreateClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Organization
        </Button>
      </div>
    </div>
  );
};

export default OrganizationsHeader;
