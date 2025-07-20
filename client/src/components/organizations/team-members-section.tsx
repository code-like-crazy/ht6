"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import MemberCard from "./member-card";
import InviteMemberCard from "./invite-member-card";
import InviteMemberModal from "./invite-member-modal";

type OrganizationMember = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  role: string;
  joinedAt: Date | null;
};

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
};

interface TeamMembersSectionProps {
  members: OrganizationMember[];
  currentUser: CurrentUser;
  organizationId: number;
  organizationName: string;
}

export default function TeamMembersSection({
  members,
  currentUser,
  organizationId,
  organizationName,
}: TeamMembersSectionProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              currentUser={currentUser}
            />
          ))}

          <InviteMemberCard onInvite={() => setIsInviteModalOpen(true)} />
        </div>

        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          organizationId={organizationId}
          organizationName={organizationName}
        />
      </CardContent>
    </Card>
  );
}
