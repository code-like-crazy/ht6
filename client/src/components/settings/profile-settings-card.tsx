"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save } from "lucide-react";
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

type ProfileSettingsCardProps = {
  user: User;
};

const ProfileSettingsCard = ({ user }: ProfileSettingsCardProps) => {
  const [name, setName] = useState(user.name);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (name === user.name) {
      toast.info("No changes to save");
      return;
    }

    startTransition(async () => {
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
        router.refresh();
      } catch (error) {
        console.error("Error updating name:", error);
        toast.error("Failed to update name");
      }
    });
  };

  return (
    <Card className="bg-card/50 border-border">
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
              disabled={isPending}
            />
            <Button
              onClick={handleUpdateName}
              disabled={isPending || name === user.name}
              size="default"
            >
              {isPending ? (
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
            Email address cannot be changed. Contact support if you need to
            update this.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettingsCard;
