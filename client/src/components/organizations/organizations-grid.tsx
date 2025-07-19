"use client";

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

type OrganizationsGridProps = {
  organizations: Organization[];
  onSelectOrganization: (organization: Organization) => void;
};

const OrganizationsGrid = ({
  organizations,
  onSelectOrganization,
}: OrganizationsGridProps) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {organizations.map((organization) => (
        <OrganizationCard
          key={organization.id}
          organization={{
            ...organization,
            createdAt: new Date(organization.createdAt),
          }}
          onSelect={onSelectOrganization}
        />
      ))}
    </div>
  );
};

export default OrganizationsGrid;
