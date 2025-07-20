import { getCurrentUser } from "@/server/services/user";
import { getProjectById } from "@/server/services/project";
import { redirect, notFound } from "next/navigation";
import ProjectDetailClient from "./project-detail-client";

interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const projectId = parseInt(params.projectId);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId, user.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} user={user} />;
};

export default ProjectDetailPage;
