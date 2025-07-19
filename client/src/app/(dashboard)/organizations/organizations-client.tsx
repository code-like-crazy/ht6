"use client";

import { useEffect, useState } from "react";
import OrganizationsHeader from "@/components/organizations/organizations-header";
import OrganizationEmptyState from "@/components/dashboard/organization-empty-state";
import OrganizationsGrid from "@/components/organizations/organizations-grid";
import CreateOrganizationModal from "@/components/organizations/create-organization-modal";
import JoinOrganizationModal from "@/components/organizations/join-organization-modal";

type Organization = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
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

  // GitHub API
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Replace with user's repository details
        const res = await fetch("/api/integrations/github?owner=vercel&repo=next.js");
        const json = await res.json();
        console.log("Fetched GitHub data:", json);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-4 lg:h-svh">
      <div className="border-border/60 bg-background flex h-full w-full flex-col rounded-xl border-2 border-dashed p-4 sm:p-8">
        <OrganizationsHeader
          onCreateClick={() => setIsCreateModalOpen(true)}
          onJoinClick={() => setIsJoinModalOpen(true)}
        />

        {organizations.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <OrganizationEmptyState
              onCreateClick={() => setIsCreateModalOpen(true)}
              onJoinClick={() => setIsJoinModalOpen(true)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <OrganizationsGrid
              organizations={organizations}
              onSelectOrganization={handleSelectOrganization}
            />
          </div>
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
    </div>
  );
};

export default OrganizationsClient;