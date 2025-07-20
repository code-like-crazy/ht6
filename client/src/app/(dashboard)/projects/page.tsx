import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/services/user";
import { getUserOrganizations } from "@/server/services/organization";
import { getProjectsByUser } from "@/server/services/project";
import ProjectsClient from "./projects-client";

export default async function ProjectsPage() {
  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Get user's organizations
  const organizations = await getUserOrganizations(user.id);

  // If user has no organizations, redirect to organizations page
  if (organizations.length === 0) {
    redirect("/organizations");
  }

  // Get all projects for the user
  const projects = await getProjectsByUser(user.id);

  return (
    <ProjectsClient
      organizations={organizations}
      projects={projects}
      user={user}
    />
  );
}
