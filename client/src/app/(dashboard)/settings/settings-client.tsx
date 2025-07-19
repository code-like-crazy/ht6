"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/dashboard/header";
import {
  User,
  Building2,
  Trash2,
  LogOut,
  Save,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

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
  const [name, setName] = useState(user.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (name === user.name) {
      toast.info("No changes to save");
      return;
    }

    setIsUpdatingName(true);

    try {
      const response = await fetch("/api/user/update-name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      toast.success("Name updated successfully");
      // Refresh the page to get updated user data
      window.location.reload();
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleLeaveOrganizations = () => {
    toast.info("Leave organizations feature coming soon");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion feature coming soon");
  };

  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-4 lg:h-svh">
      <div className="border-border/60 bg-background flex h-full w-full flex-col rounded-xl border-2 border-dashed p-4 sm:p-8">
        <DashboardHeader
          title="Settings"
          description="Manage your account settings, preferences, and organization memberships."
        />

        <div className="mt-6 space-y-6 sm:mt-8">
          {/* Profile Settings */}
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {user.imageUrl && (
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-foreground font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your display name"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpdateName}
                    disabled={isUpdatingName || name === user.name}
                    size="default"
                  >
                    {isUpdatingName ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-muted-foreground text-xs">
                  Email address cannot be changed. Contact support if you need
                  to update this.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Organization Settings */}
          <Card className="bg-card/50 border-border/40">
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
                    Remove yourself from all organizations you&apos;re a member
                    of
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

              <div className="border-border/40 border-t pt-4">
                <div className="bg-accent/10 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="text-accent mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        Organization Management
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        You can manage individual organization memberships from
                        the Organizations page. Use the &ldquo;Leave All&rdquo;
                        option only if you want to remove yourself from every
                        organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
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
                      Deleting your account will permanently remove all your
                      data, including organizations you own, projects, and chat
                      history. Other team members will lose access to shared
                      resources.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
