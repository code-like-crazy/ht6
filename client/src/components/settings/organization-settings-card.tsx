"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";

const OrganizationSettingsCard = () => {
  const handleLeaveOrganizations = () => {
    toast.info("Leave organizations feature coming soon");
  };

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground font-medium">
              Leave All Organizations
            </p>
            <p className="text-muted-foreground text-sm">
              Remove yourself from all organizations you&apos;re a member of
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLeaveOrganizations}
            className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Leave All
          </Button>
        </div>

        <div className="border-border border-t pt-4">
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-accent mt-0.5 h-5 w-5" />
              <div>
                <p className="text-foreground text-sm font-medium">
                  Organization Management
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  You can manage individual organization memberships from the
                  Organizations page. Use the &ldquo;Leave All&rdquo; option
                  only if you want to remove yourself from every organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationSettingsCard;
