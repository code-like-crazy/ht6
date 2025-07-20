"use client";

import { useState } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import PageHeader from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  MessageSquare,
  FileText,
  Users,
  Activity,
  Plus,
  Github,
  Slack,
  Figma,
  Link as LinkIcon,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface ProjectDetailClientProps {
  project: ProjectWithOrganization;
  user: User;
}

export default function ProjectDetailClient({
  project,
  user,
}: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for project details - in real app this would come from props/API
  const projectStats = [
    {
      label: "Knowledge Items",
      value: "247",
      icon: FileText,
      trend: "+12 this week",
    },
    {
      label: "Team Members",
      value: "8",
      icon: Users,
      trend: "+1 this month",
    },
    {
      label: "Questions Asked",
      value: "89",
      icon: MessageSquare,
      trend: "+15 today",
    },
    {
      label: "Integrations",
      value: "4",
      icon: LinkIcon,
      trend: "All connected",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "GitHub repository connected",
      time: "2 hours ago",
      user: "Sarah Chen",
      type: "integration",
    },
    {
      id: 2,
      action: "New knowledge item indexed",
      time: "4 hours ago",
      user: "System",
      type: "knowledge",
    },
    {
      id: 3,
      action: "Team member added",
      time: "1 day ago",
      user: "Mike Johnson",
      type: "team",
    },
    {
      id: 4,
      action: "Slack workspace connected",
      time: "2 days ago",
      user: "You",
      type: "integration",
    },
  ];

  const integrations = [
    {
      name: "GitHub",
      icon: Github,
      status: "connected",
      description: "Main repository",
      lastSync: "2 hours ago",
    },
    {
      name: "Slack",
      icon: Slack,
      status: "connected",
      description: "Team workspace",
      lastSync: "1 hour ago",
    },
    {
      name: "Figma",
      icon: Figma,
      status: "disconnected",
      description: "Design files",
      lastSync: "Never",
    },
    {
      name: "Linear",
      icon: LinkIcon,
      status: "connected",
      description: "Issue tracking",
      lastSync: "30 minutes ago",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center p-2 sm:p-4 lg:min-h-svh">
      <div className="bg-background flex h-full w-full flex-col rounded-xl p-4 sm:p-8">
        <PageHeader
          title={project.name}
          description={
            project.description ||
            `Project in ${project.organization.name} organization`
          }
          actions={[
            {
              label: "Ask Question",
              icon: MessageSquare,
              href: `/projects/${project.id}/chat`,
            },
            {
              label: "Settings",
              icon: Settings,
              href: `/projects/${project.id}/settings`,
            },
          ]}
        />

        {/* Project Info Card */}
        <Card className="bg-card/50 border-border mt-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {project.organization.icon && (
                    <span className="text-lg">{project.organization.icon}</span>
                  )}
                  <div>
                    <h3 className="text-foreground font-semibold">
                      {project.organization.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Organization
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Project ID: {project.id}
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href={`/projects/${project.id}/chat`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Asking Questions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projectStats.map((stat, index) => (
            <Card key={index} className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-foreground text-2xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {stat.trend}
                    </p>
                  </div>
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                    <stat.icon className="text-primary h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="bg-card/50 border-border lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${project.id}/activity`}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 last:pb-0"
                >
                  <div className="bg-muted mt-1 flex h-8 w-8 items-center justify-center rounded-full">
                    {activity.type === "integration" && (
                      <LinkIcon className="text-muted-foreground h-4 w-4" />
                    )}
                    {activity.type === "knowledge" && (
                      <FileText className="text-muted-foreground h-4 w-4" />
                    )}
                    {activity.type === "team" && (
                      <Users className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-foreground text-sm font-medium">
                      {activity.action}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Integrations
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${project.id}/integrations`}>
                  <Plus className="mr-1 h-3 w-3" />
                  Add
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="border-border/30 bg-background/50 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded">
                      <integration.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {integration.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        integration.status === "connected"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {integration.status}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {integration.lastSync}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card/50 border-border mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button className="justify-start" variant="outline" asChild>
                <Link href={`/projects/${project.id}/chat`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask Questions
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href={`/projects/${project.id}/integrations`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Integration
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href={`/projects/${project.id}/team`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href={`/projects/${project.id}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Project Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
