import { getCurrentUser } from "@/server/services/user";
import { getProjectById, getProjectsByUser } from "@/server/services/project";
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

  const [project, allUserProjects] = await Promise.all([
    getProjectById(projectId, user.id),
    getProjectsByUser(user.id),
  ]);

  if (!project) {
    notFound();
  }

  // Transform projects for the breadcrumbs component
  const availableProjects = allUserProjects
    .filter((p) => p.id !== project.id)
    .map((p) => ({
      id: p.id,
      name: p.name,
      organizationId: p.organizationId,
      organizationName: p.organization.name,
    }));

  return (
    <ProjectDetailClient
      project={project}
      user={user}
      availableProjects={availableProjects}
    />
  );
};

export default ProjectDetailPage;
