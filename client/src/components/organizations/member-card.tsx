"use client";

import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
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

interface MemberCardProps {
  member: OrganizationMember;
  currentUser: CurrentUser;
}

export default function MemberCard({ member, currentUser }: MemberCardProps) {
  const isCurrentUser = member.id === currentUser.id;

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
    <div
      className={`group relative overflow-hidden rounded-lg border p-4 py-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        isCurrentUser
          ? "bg-primary/5 border-primary/20 shadow-sm"
          : "bg-background/50 border-border hover:border-primary/30"
      }`}
    >
      {/* Role badge in corner */}
      <Badge
        className={`${getRoleBadgeColor(member.role)} absolute top-2 right-2 px-1.5 py-0.5 text-xs`}
        variant="outline"
      >
        {member.role.toUpperCase()}
      </Badge>

      <div className="flex flex-col items-center space-y-3">
        {/* Avatar with role indicator */}
        <div className="relative">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={48}
              height={48}
              className="ring-border group-hover:ring-primary/50 h-12 w-12 rounded-full object-cover ring-2 transition-all"
            />
          ) : (
            <div className="bg-muted ring-border group-hover:ring-primary/50 flex h-12 w-12 items-center justify-center rounded-full ring-2 transition-all">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
          )}
          <div className="bg-background border-border absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm">
            <span className="text-xs">{getRoleIcon(member.role)}</span>
          </div>
        </div>

        {/* Member info - simplified hierarchy */}
        <div className="w-full space-y-2 text-center">
          {/* Name - primary info */}
          <div className="space-y-1">
            <h3 className="text-foreground truncate text-sm leading-tight font-semibold">
              {member.name}
              {isCurrentUser && (
                <span className="text-primary ml-1 text-xs font-medium">
                  (You)
                </span>
              )}
            </h3>
          </div>

          {/* Secondary info - simplified */}
          <div className="space-y-1">
            <p className="text-muted-foreground truncate text-xs">
              {member.email}
            </p>
            {member.joinedAt && (
              <p className="text-muted-foreground text-xs">
                Joined {formatDistanceToNow(new Date(member.joinedAt))} ago
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
