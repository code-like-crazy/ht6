"use client";

import ProjectChatInterface from "@/components/projects/project-chat-interface";
import ProjectSidebar from "@/components/projects/project-sidebar";
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
}

export default function ProjectDetailClient({
  project,
  user,
}: ProjectDetailClientProps) {
  return (
    <div className="flex h-full w-full gap-4 p-2 sm:p-4 lg:min-h-svh">
      {/* Main Chat Interface */}
      <div className="bg-background flex h-full flex-1 flex-col rounded-xl p-4 sm:p-8">
        <ProjectChatInterface project={project} user={user} />
      </div>

      {/* Right Sidebar */}
      <div className="bg-background flex h-full w-[480px] flex-col rounded-xl p-4 sm:p-6">
        <ProjectSidebar project={project} user={user} />
      </div>
    </div>
  );
}
