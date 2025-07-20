import { Button } from "@/components/ui/button";
import { Building2, Plus, Users, ArrowRight, UserPlus } from "lucide-react";
import { useOrganizationModals } from "@/components/providers/organization-modal-provider";

type OrganizationEmptyStateProps = {
  onCreateClick?: () => void;
  onJoinClick?: () => void;
};

const OrganizationEmptyState = ({
  onCreateClick,
  onJoinClick,
}: OrganizationEmptyStateProps = {}) => {
  const { openCreateModal, openJoinModal } = useOrganizationModals();
  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-4 lg:h-svh">
      <div className="border-border/60 bg-background flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed py-6">
        <div className="max-w-4xl px-4 text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full sm:mb-8 sm:h-16 sm:w-16">
            <Building2 className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          </div>

          <h1 className="text-foreground mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
            Welcome to HT6
          </h1>

          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-sm leading-relaxed sm:mb-8 sm:text-base">
            Get started by creating your first organization. Organizations are
            workspaces where your team can collaborate, create projects, and
            build a comprehensive knowledge base from your development tools.
          </p>

          <div className="mx-auto mb-6 grid max-w-3xl grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
            <div className="bg-card/50 border-border rounded-lg border p-4 text-center shadow-md">
              <div className="bg-accent/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="text-accent h-5 w-5" />
              </div>
              <h3 className="text-foreground mb-2 text-sm font-semibold">
                Team Workspace
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Invite team members and collaborate together on projects
              </p>
            </div>

            <div className="bg-card/50 border-border rounded-lg border p-4 text-center shadow-md">
              <div className="bg-accent/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Building2 className="text-accent h-5 w-5" />
              </div>
              <h3 className="text-foreground mb-2 text-sm font-semibold">
                Multiple Projects
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Create and manage multiple projects within your organization
              </p>
            </div>

            <div className="bg-card/50 border-border rounded-lg border p-4 text-center shadow-md">
              <div className="bg-accent/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <ArrowRight className="text-accent h-5 w-5" />
              </div>
              <h3 className="text-foreground mb-2 text-sm font-semibold">
                Unified Knowledge
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Connect GitHub, Slack, Linear, and more for instant answers
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="default"
              className="px-6 py-2 text-sm"
              onClick={onCreateClick || openCreateModal}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>

            <Button
              variant="outline"
              size="default"
              className="px-6 py-2 text-sm"
              onClick={onJoinClick || openJoinModal}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join Organization
            </Button>
          </div>

          <div className="border-border mt-8 border-t pt-6">
            <p className="text-muted-foreground text-xs">
              Need help getting started?{" "}
              <a
                href="#"
                className="text-primary font-medium transition-colors hover:underline"
              >
                View our setup guide
              </a>{" "}
              or{" "}
              <a
                href="#"
                className="text-primary font-medium transition-colors hover:underline"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEmptyState;
