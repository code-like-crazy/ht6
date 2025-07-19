"use client";

import DashboardHeader from "@/components/dashboard/header";
import OrganizationEmptyState from "@/components/dashboard/organization-empty-state";
import OrganizationCard from "@/components/dashboard/organization-card";

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
  const handleSelectOrganization = (organization: Organization) => {
    // TODO: Navigate to organization dashboard
    console.log("Selected organization:", organization);
  };

  if (organizations.length === 0) {
    return <OrganizationEmptyState />;
  }

  return (
    <div className="p-4 sm:p-8">
      <DashboardHeader
        title="Your Organizations"
        description="Select an organization to view its projects and start collaborating with your team."
        createButtonText="Create Organization"
        createButtonHref="/organization/create"
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {organizations.map((organization) => (
          <OrganizationCard
            key={organization.id}
            organization={{
              ...organization,
              createdAt: new Date(organization.createdAt),
            }}
            onSelect={handleSelectOrganization}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardClient;
