"use client";

import { useState } from "react";
import OrganizationsHeader from "@/components/organizations/organizations-header";
import OrganizationsEmptyState from "@/components/organizations/organizations-empty-state";
import OrganizationsGrid from "@/components/organizations/organizations-grid";
import CreateOrganizationModal from "@/components/organizations/create-organization-modal";
import JoinOrganizationModal from "@/components/organizations/join-organization-modal";

type Organization = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  role: string;
  createdAt: Date;
};

type OrganizationsClientProps = {
  organizations: Organization[];
};

const OrganizationsClient = ({ organizations }: OrganizationsClientProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleSelectOrganization = (organization: Organization) => {
    // TODO: Navigate to organization dashboard
    console.log("Selected organization:", organization);
  };

  return (
    <div className="bg-background p-4 sm:p-8">
      <OrganizationsHeader
        onCreateClick={() => setIsCreateModalOpen(true)}
        onJoinClick={() => setIsJoinModalOpen(true)}
      />

      {organizations.length === 0 ? (
        <OrganizationsEmptyState
          onCreateClick={() => setIsCreateModalOpen(true)}
          onJoinClick={() => setIsJoinModalOpen(true)}
        />
      ) : (
        <OrganizationsGrid
          organizations={organizations}
          onSelectOrganization={handleSelectOrganization}
        />
      )}

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <JoinOrganizationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default OrganizationsClient;
