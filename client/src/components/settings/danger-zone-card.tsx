"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const DangerZoneCard = () => {
  const handleDeleteAccount = () => {
    toast.error("Account deletion feature coming soon");
  };

  return (
    <Card className="bg-card/50 border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground font-medium">Delete Account</p>
            <p className="text-muted-foreground text-sm">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>

        <div className="bg-destructive/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
            <div>
              <p className="text-foreground text-sm font-medium">
                This action cannot be undone
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Deleting your account will permanently remove all your data,
                including organizations you own, projects, and chat history.
                Other team members will lose access to shared resources.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneCard;
