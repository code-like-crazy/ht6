import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Zap, BookOpen } from "lucide-react";

export default function ProjectDetailLoading() {
  return (
    <div className="flex h-full w-full gap-4 p-2 sm:p-4 lg:min-h-svh">
      {/* Main Chat Interface */}
      <div className="bg-background flex h-full flex-1 flex-col rounded-xl p-4 sm:p-8">
        {/* Project Header Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>

        {/* Chat Interface Skeleton */}
        <div className="flex flex-1 flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 space-y-4 overflow-hidden rounded-lg border p-4">
            {/* Welcome Message Skeleton */}
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>

            {/* Sample Messages */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area Skeleton */}
          <div className="mt-4 flex items-end gap-2">
            <div className="flex-1">
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="bg-background flex h-full w-[480px] flex-col rounded-xl p-4 sm:p-6">
        {/* Sidebar Header */}
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-muted mb-4 flex space-x-1 rounded-lg p-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 flex-1 rounded-md" />
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Quick Actions Section */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </CardContent>
          </Card>

          {/* Integrations Section */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-sm">
                <Link className="h-4 w-4" />
                Connected Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Knowledge Base Section */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
