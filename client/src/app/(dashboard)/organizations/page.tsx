import { getCurrentUser } from "@/server/services/user";
import { getUserOrganizations } from "@/server/services/organization";
import { redirect } from "next/navigation";
import OrganizationsClient from "./organizations-client";

const OrganizationsPage = async () => {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const organizations = await getUserOrganizations(user.id);

  // Convert Date objects to serializable format
  const serializedOrganizations = organizations.map((org) => ({
    ...org,
    createdAt: org.createdAt,
  }));

  return <OrganizationsClient organizations={serializedOrganizations} />;
};

export default OrganizationsPage;
