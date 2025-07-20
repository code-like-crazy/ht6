"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/page-header";
import CreateProjectModal from "@/components/projects/create-project-modal";
import {
  Building2,
  Users,
  FolderOpen,
  Plus,
  User,
  Calendar,
  Mail,
  Settings,
  Github,
} from "lucide-react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

// Integration Icons (SVG components for services not in Lucide)
const NotionIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233c.794-.047 1.007.233 1.548.933l4.904 7.747v-6.719l-1.026-.093c-.093-.514.28-.887.747-.933z" />
  </svg>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148z" />
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const LinearIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.125 16.5c-1.5 1.5-3.5 2.25-5.625 2.25s-4.125-.75-5.625-2.25S4.625 13 4.625 10.875s.75-4.125 2.25-5.625S10.375 2.625 12.5 2.625s4.125.75 5.625 2.25 2.25 3.5 2.25 5.625-.75 4.125-2.25 5.625z" />
  </svg>
);

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

type OrganizationMember = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  role: string;
  joinedAt: Date | null;
};

type ProjectWithOrganization = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  organizationId: number;
  createdById: number;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  organization: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    icon: string | null;
  };
};

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
};

interface OrganizationDetailClientProps {
  organization: OrganizationDetails;
  members: OrganizationMember[];
  projects: ProjectWithOrganization[];
  currentUser: CurrentUser;
  canCreateProjects: boolean;
}

export default function OrganizationDetailClient({
  organization,
  members,
  projects,
  currentUser,
  canCreateProjects,
}: OrganizationDetailClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // Mock integrations for projects (dummy data)
  const getProjectIntegrations = (projectId: number) => {
    const allIntegrations = [
      { name: "GitHub", icon: Github, connected: true },
      { name: "Notion", icon: NotionIcon, connected: true },
      { name: "Figma", icon: FigmaIcon, connected: false },
      { name: "Slack", icon: SlackIcon, connected: true },
      { name: "Linear", icon: LinearIcon, connected: false },
    ];

    // Return random subset for demo
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 integrations
    return allIntegrations.slice(0, count);
  };

  const IconComponent = getIconComponent(organization.icon);

  const actions = [];
  if (canCreateProjects) {
    actions.push({
      label: "Create Project",
      icon: Plus,
      onClick: () => setIsCreateModalOpen(true),
    });
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-2 sm:p-4 lg:min-h-svh">
      <div className="bg-background flex h-full w-full flex-col space-y-6 rounded-xl p-4 sm:p-8 md:space-y-8">
        <PageHeader
          title={organization.name}
          description={
            organization.description ||
            "Manage projects, members, and collaborate with your team."
          }
          actions={actions}
        />

        {/* Organization Overview */}
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
                    Created{" "}
                    {formatDistanceToNow(new Date(organization.createdAt))} ago
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
                  <span className="font-medium">{members.length}</span> members
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">
                  <span className="font-medium">{projects.length}</span>{" "}
                  projects
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">
                  Created{" "}
                  {new Date(organization.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Section */}
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
                              {formatDistanceToNow(new Date(member.joinedAt))}{" "}
                              ago
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

        {/* Projects Section */}
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Projects ({projects.length})
            </CardTitle>
            {canCreateProjects && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="py-12 text-center">
                <FolderOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 font-medium">
                  No projects yet
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {canCreateProjects
                    ? "Create your first project to get started."
                    : "No projects have been created in this organization yet."}
                </p>
                {canCreateProjects && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                  const integrations = getProjectIntegrations(project.id);

                  return (
                    <div
                      key={project.id}
                      className="group bg-background/50 border-border hover:border-primary/30 cursor-pointer rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <h3 className="text-foreground group-hover:text-primary line-clamp-1 font-medium transition-colors">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created{" "}
                            {formatDistanceToNow(new Date(project.createdAt))}{" "}
                            ago
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">
                              Integrations
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {integrations.filter((i) => i.connected).length}/
                              {integrations.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {integrations.map((integration, index) => {
                              const IconComp = integration.icon;
                              return (
                                <div
                                  key={index}
                                  className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all ${
                                    integration.connected
                                      ? "bg-primary/10 border-primary/20 text-primary"
                                      : "bg-muted/50 border-border text-muted-foreground"
                                  }`}
                                  title={`${integration.name} ${integration.connected ? "(Connected)" : "(Not connected)"}`}
                                >
                                  <IconComp />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {canCreateProjects && (
          <CreateProjectModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            organizations={[
              {
                id: organization.id,
                name: organization.name,
                slug: organization.slug,
                description: organization.description,
                imageUrl: organization.imageUrl,
                icon: organization.icon,
                role: organization.userRole,
                createdAt: organization.createdAt,
              },
            ]}
            selectedOrganization={organization.id.toString()}
            user={currentUser}
          />
        )}
      </div>
    </div>
  );
}
