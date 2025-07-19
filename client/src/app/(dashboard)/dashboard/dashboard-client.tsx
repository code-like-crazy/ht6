"use client";

import DashboardHeader from "@/components/dashboard/header";
import OrganizationEmptyState from "@/components/dashboard/organization-empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

type Organization = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  role: string;
  createdAt: Date;
};

type DashboardClientProps = {
  organizations: Organization[];
};

const DashboardClient = ({ organizations }: DashboardClientProps) => {
  if (organizations.length === 0) {
    return <OrganizationEmptyState />;
  }

  // Mock data for dashboard - in real app this would come from props/API
  const recentActivity = [
    {
      id: 1,
      action: "New project created",
      project: "Mobile App Redesign",
      time: "2 hours ago",
      user: "Sarah Chen",
    },
    {
      id: 2,
      action: "Knowledge base updated",
      project: "API Documentation",
      time: "4 hours ago",
      user: "Mike Johnson",
    },
    {
      id: 3,
      action: "Team member joined",
      project: "Frontend Team",
      time: "1 day ago",
      user: "Alex Rivera",
    },
    {
      id: 4,
      action: "Integration connected",
      project: "Slack Workspace",
      time: "2 days ago",
      user: "You",
    },
  ];

  const quickStats = [
    {
      label: "Active Projects",
      value: "12",
      icon: FileText,
      trend: "+2 this week",
    },
    { label: "Team Members", value: "24", icon: Users, trend: "+3 this month" },
    {
      label: "Knowledge Items",
      value: "1,247",
      icon: Zap,
      trend: "+89 this week",
    },
    {
      label: "Questions Answered",
      value: "156",
      icon: MessageSquare,
      trend: "+23 today",
    },
  ];

  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-4 lg:h-svh">
      <div className="border-border/60 bg-background flex h-full w-full flex-col rounded-xl border-2 border-dashed p-4 sm:p-8">
        <DashboardHeader
          title="Dashboard Overview"
          description="Monitor your team's progress, recent activity, and key metrics across all projects."
          createButtonText="New Project"
          createButtonHref="/projects/create"
        />

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-card/50 border-border/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-foreground text-2xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-accent text-xs">{stat.trend}</p>
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
          <Card className="bg-card/50 border-border/40 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/activity">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 last:pb-0"
                >
                  <div className="bg-accent/10 mt-1 flex h-8 w-8 items-center justify-center rounded-full">
                    <Clock className="text-accent h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-foreground text-sm font-medium">
                      {activity.action}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {activity.project} • {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/integrations">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Connect Tools
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/team/invite">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Team
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Section */}
        <Card className="bg-card/50 border-border/40 mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">
              Your Organizations
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/organizations">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.slice(0, 3).map((org) => (
                <div
                  key={org.id}
                  className="bg-background/50 border-border/30 rounded-lg border p-3"
                >
                  <h4 className="text-foreground font-medium">{org.name}</h4>
                  <p className="text-muted-foreground text-sm">{org.role}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {org.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardClient;
