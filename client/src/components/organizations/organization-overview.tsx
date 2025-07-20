"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FolderOpen, Calendar } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "@/lib/utils";

type OrganizationDetails = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  createdById: number;
  createdAt: Date;
  userRole: string;
};

interface OrganizationOverviewProps {
  organization: OrganizationDetails;
  memberCount: number;
  projectCount: number;
}

export default function OrganizationOverview({
  organization,
  memberCount,
  projectCount,
}: OrganizationOverviewProps) {
  const getIconComponent = (iconName?: string | null) => {
    if (!iconName) return Building2;

    const formattedIconName =
      iconName.charAt(0).toUpperCase() + iconName.slice(1);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lucideIcons = LucideIcons as any;
      const IconComponent =
        lucideIcons[formattedIconName] || lucideIcons[iconName];

      if (typeof IconComponent === "function") {
        return IconComponent;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn(`Icon "${iconName}" not found in lucide-react`);
    }

    return Building2;
  };

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

  const IconComponent = getIconComponent(organization.icon);

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            {organization.imageUrl ? (
              <Image
                src={organization.imageUrl}
                alt={organization.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <IconComponent className="text-primary h-6 w-6" />
            )}
          </div>
          <div>
            <h2 className="text-foreground font-serif text-xl">
              {organization.name}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={getRoleBadgeColor(organization.userRole)}>
                {organization.userRole}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Created {formatDistanceToNow(new Date(organization.createdAt))}{" "}
                ago
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              <span className="font-medium">{memberCount}</span> members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FolderOpen className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              <span className="font-medium">{projectCount}</span> projects
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              Created {new Date(organization.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
