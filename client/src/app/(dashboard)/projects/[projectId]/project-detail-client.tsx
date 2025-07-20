"use client";

import ProjectChatInterface from "@/components/projects/project-chat-interface";
import ProjectSidebar from "@/components/projects/project-sidebar";
import ProjectHeader from "@/components/projects/project-header";
import { ProjectWithOrganization } from "@/server/services/project";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface ProjectDetailClientProps {
  project: ProjectWithOrganization;
  user: User;
  availableProjects?: Array<{
    id: number;
    name: string;
    organizationId: number;
    organizationName: string;
  }>;
}

export default function ProjectDetailClient({
  project,
  user,
  availableProjects = [],
}: ProjectDetailClientProps) {
  // For now, we'll use demo mode. In the future, this could be controlled by
  // user preferences, project settings, or environment variables
  const isDemo = false;

  return (
    <div className="relative flex h-full w-full gap-4 p-2 sm:p-4 lg:min-h-svh">
      {/* Main Chat Interface */}
      <div className="bg-background mr-[496px] flex h-full flex-1 flex-col rounded-xl p-4 sm:p-8">
        <ProjectHeader
          project={project}
          availableProjects={availableProjects}
        />
        <ProjectChatInterface project={project} user={user} />
      </div>

      {/* Right Sidebar */}
      <div className="bg-background fixed top-4 right-4 flex h-full w-[480px] flex-col overflow-y-auto rounded-xl p-4 sm:p-6 md:max-h-[calc(100svh-2rem)]">
        <ProjectSidebar project={project} user={user} isDemo={isDemo} />
      </div>
    </div>
  );
}
