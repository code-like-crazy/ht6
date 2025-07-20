import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, FolderOpen, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

type Organization = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  role: string;
  createdAt: Date;
};

type OrganizationCardProps = {
  organization: Organization;
  projectCount?: number;
  memberCount?: number;
  onSelect?: (organization: Organization) => void;
};

const OrganizationCard = ({
  organization,
  projectCount = 0,
  memberCount = 1,
  onSelect,
}: OrganizationCardProps) => {
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

  const getIconComponent = (iconName?: string | null) => {
    if (!iconName) return Building2;

    // Convert icon name to PascalCase if needed
    const formattedIconName =
      iconName.charAt(0).toUpperCase() + iconName.slice(1);

    // Try to get the icon component from lucide-react
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lucideIcons = LucideIcons as any;
      const IconComponent =
        lucideIcons[formattedIconName] || lucideIcons[iconName];

      // Check if it's a valid React component
      if (typeof IconComponent === "function") {
        return IconComponent;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn(`Icon "${iconName}" not found in lucide-react`);
    }

    return Building2;
  };

  const IconComponent = getIconComponent(organization.icon);

  return (
    <Card className="border-border group hover:border-primary/50 cursor-pointer p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              {organization.imageUrl ? (
                <Image
                  src={organization.imageUrl}
                  alt={organization.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <IconComponent className="text-primary h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground group-hover:text-primary truncate font-serif text-sm font-semibold transition-colors">
                {organization.name}
              </h3>
              <span
                className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                  organization.role,
                )}`}
              >
                {organization.role}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {organization.description && (
          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
            {organization.description}
          </p>
        )}

        <div className="text-muted-foreground mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <FolderOpen className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{projectCount} projects</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{memberCount} members</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground truncate text-xs">
            Created{" "}
            {new Date(organization.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <Button
            onClick={() => onSelect?.(organization)}
            variant="outline"
            size="sm"
            className="ml-2 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            Open
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center space-x-4">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
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
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground group-hover:text-primary font-serif text-lg font-semibold transition-colors">
                {organization.name}
              </h3>
              {organization.description && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {organization.description}
                </p>
              )}
              <div className="text-muted-foreground mt-2 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <FolderOpen className="h-4 w-4" />
                  <span>{projectCount} projects</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{memberCount} members</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center space-x-2">
            <span
              className={`rounded-full border px-2 py-1 text-xs font-medium ${getRoleBadgeColor(
                organization.role,
              )}`}
            >
              {organization.role}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Created{" "}
            {new Date(organization.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <Button
            onClick={() => onSelect?.(organization)}
            variant="outline"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            Open Dashboard
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OrganizationCard;
