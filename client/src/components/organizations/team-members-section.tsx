"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Mail, Calendar } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "@/lib/utils";

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
}

export default function TeamMembersSection({
  members,
  currentUser,
}: TeamMembersSectionProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-primary/10 text-primary border-primary/20";
      case "manager":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return "👑";
      case "manager":
        return "⭐";
      default:
        return "👤";
    }
  };

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
          {members.map((member) => {
            const isCurrentUser = member.id === currentUser.id;

            return (
              <div
                key={member.id}
                className={`group relative overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  isCurrentUser
                    ? "bg-primary/5 border-primary/20 shadow-sm"
                    : "bg-background/50 border-border hover:border-primary/30"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={56}
                        height={56}
                        className="ring-border group-hover:ring-primary/50 h-14 w-14 rounded-full object-cover ring-2 transition-all"
                      />
                    ) : (
                      <div className="bg-muted ring-border group-hover:ring-primary/50 flex h-14 w-14 items-center justify-center rounded-full ring-2 transition-all">
                        <User className="text-muted-foreground h-6 w-6" />
                      </div>
                    )}
                    <div className="bg-background border-border absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm">
                      <span className="text-xs">
                        {getRoleIcon(member.role)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-2 text-center">
                    <div>
                      <h3 className="text-foreground truncate text-sm font-medium">
                        {member.name}
                        {isCurrentUser && (
                          <span className="text-primary ml-1 text-xs font-normal">
                            (You)
                          </span>
                        )}
                      </h3>
                      <div className="text-muted-foreground mt-1 flex items-center justify-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>

                    <Badge
                      className={`${getRoleBadgeColor(member.role)} px-2 py-1 text-xs`}
                      variant="outline"
                    >
                      {member.role}
                    </Badge>

                    {member.joinedAt && (
                      <div className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Joined{" "}
                          {formatDistanceToNow(new Date(member.joinedAt))} ago
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
