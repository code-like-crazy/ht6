"use client";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface InviteMemberCardProps {
  onInvite: () => void;
}

export default function InviteMemberCard({ onInvite }: InviteMemberCardProps) {
  return (
    <div className="group border-border hover:border-primary/50 relative overflow-hidden rounded-lg border border-dashed transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Button
        variant="ghost"
        className="h-full w-full flex-col space-y-3 p-4"
        onClick={onInvite}
      >
        <div className="bg-primary/10 ring-primary/20 group-hover:ring-primary/50 flex h-12 w-12 items-center justify-center rounded-full ring-2 transition-all">
          <UserPlus className="text-primary h-5 w-5" />
        </div>

        <div className="w-full space-y-1 text-center">
          <h3 className="text-foreground text-sm font-semibold">
            Invite Member
          </h3>
          <p className="text-muted-foreground text-xs">Add a new team member</p>
        </div>
      </Button>
    </div>
  );
}
