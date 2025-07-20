"use client";

import { useEffect } from "react";
import PageHeader from "@/components/shared/page-header";
import OrganizationEmptyState from "@/components/dashboard/organization-empty-state";
import OrganizationsGrid from "@/components/organizations/organizations-grid";
import { useOrganizationModals } from "@/components/providers/organization-modal-provider";
import { Plus, UserPlus } from "lucide-react";

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
  const { openCreateModal, openJoinModal } = useOrganizationModals();

  const handleSelectOrganization = (organization: Organization) => {
    // TODO: Navigate to organization dashboard
    console.log("Selected organization:", organization);
  };

  // GitHub API
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Replace with user's repository details
        const res = await fetch(
          "/api/integrations/github?owner=vercel&repo=next.js",
        );
        const json = await res.json();
        console.log("Fetched GitHub data:", json);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-2 sm:p-4 lg:min-h-svh">
      <div className="bg-background flex h-full w-full flex-col rounded-xl p-4 sm:p-8">
        <PageHeader
          title="Organizations"
          description="Manage your organizations and collaborate with your teams."
          actions={[
            {
              label: "Join Organization",
              icon: UserPlus,
              variant: "outline",
              onClick: openJoinModal,
            },
            {
              label: "Create Organization",
              icon: Plus,
              onClick: openCreateModal,
            },
          ]}
        />

        {organizations.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <OrganizationEmptyState
              onCreateClick={openCreateModal}
              onJoinClick={openJoinModal}
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
      </div>
    </div>
  );
};

export default OrganizationsClient;
