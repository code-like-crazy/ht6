"use client";

import PageHeader from "@/components/shared/page-header";
import ProfileSettingsCard from "@/components/settings/profile-settings-card";
import OrganizationSettingsCard from "@/components/settings/organization-settings-card";
import DangerZoneCard from "@/components/settings/danger-zone-card";

type User = {
  id: number;
  auth0Id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type SettingsClientProps = {
  user: User;
};

const SettingsClient = ({ user }: SettingsClientProps) => {
  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-4 lg:min-h-svh">
      <div className="bg-background flex h-full w-full flex-col rounded-xl p-4 sm:p-8">
        <PageHeader
          title="Settings"
          description="Manage your account settings, preferences, and organization memberships."
        />

        <div className="mt-6 space-y-6 sm:mt-8">
          <ProfileSettingsCard user={user} />
          <OrganizationSettingsCard />
          <DangerZoneCard />
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
