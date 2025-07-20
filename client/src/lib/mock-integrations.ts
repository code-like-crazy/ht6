import { ProjectIntegration } from "@/components/projects/project-card";

// Mock integrations for projects (dummy data)
export const getProjectIntegrations = (
  projectId: number,
): ProjectIntegration[] => {
  const allIntegrations: ProjectIntegration[] = [
    { id: "github", status: "connected" },
    { id: "slack", status: "connected" },
    { id: "figma", status: "disconnected" },
    { id: "linear", status: "connected" },
  ];

  // Return random subset for demo based on project ID
  const seed = projectId;
  const count = (seed % 3) + 2; // 2-4 integrations
  const shuffled = [...allIntegrations].sort(() => (seed % 2) - 0.5);

  return shuffled.slice(0, count);
};
