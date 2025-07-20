"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Hash, Lock } from "lucide-react";

interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
  num_members?: number;
  purpose?: {
    value: string;
  };
}

interface SlackChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  connectionName: string;
}

export default function SlackChannelsModal({
  isOpen,
  onClose,
  projectId,
  connectionName,
}: SlackChannelsModalProps) {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen, projectId]);

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/integrations/slack?projectId=${projectId}&action=channels`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.channels) {
          setChannels(data.channels);

          // Load previously selected channels from connection settings
          const connectionResponse = await fetch(
            `/api/integrations/slack?projectId=${projectId}`,
          );
          if (connectionResponse.ok) {
            const connectionData = await connectionResponse.json();
            const savedChannels =
              connectionData.connection?.settings?.selectedChannels || [];
            setSelectedChannels(new Set(savedChannels));
          }
        }
      } else {
        console.error("Failed to fetch channels:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch Slack channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChannelToggle = (channelId: string) => {
    const newSelected = new Set(selectedChannels);
    if (newSelected.has(channelId)) {
      newSelected.delete(channelId);
    } else {
      newSelected.add(channelId);
    }
    setSelectedChannels(newSelected);
  };

  const handleSelectAll = () => {
    const accessibleChannels = filteredChannels.filter(
      (channel) => channel.is_member,
    );
    const accessibleChannelIds = new Set(accessibleChannels.map((c) => c.id));
    const selectedAccessibleChannels = Array.from(selectedChannels).filter(
      (id) => accessibleChannelIds.has(id),
    );

    if (selectedAccessibleChannels.length === accessibleChannels.length) {
      // Remove all accessible channels from selection
      const newSelected = new Set(selectedChannels);
      accessibleChannels.forEach((channel) => newSelected.delete(channel.id));
      setSelectedChannels(newSelected);
    } else {
      // Add all accessible channels to selection
      const newSelected = new Set(selectedChannels);
      accessibleChannels.forEach((channel) => newSelected.add(channel.id));
      setSelectedChannels(newSelected);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here we would save the selected channels to the connection settings
      const response = await fetch("/api/integrations/slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          selectedChannels: Array.from(selectedChannels),
        }),
      });

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to save channel selection:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Slack Channels</DialogTitle>
          <DialogDescription>
            Choose which channels from {connectionName} you want Loominal to
            access for context and knowledge extraction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={isLoading}
            >
              {(() => {
                const accessibleChannels = filteredChannels.filter(
                  (channel) => channel.is_member,
                );
                const accessibleChannelIds = new Set(
                  accessibleChannels.map((c) => c.id),
                );
                const selectedAccessibleChannels = Array.from(
                  selectedChannels,
                ).filter((id) => accessibleChannelIds.has(id));
                return selectedAccessibleChannels.length ===
                  accessibleChannels.length
                  ? "Deselect All"
                  : "Select All Accessible";
              })()}
            </Button>
            <span className="text-muted-foreground text-sm">
              {selectedChannels.size} of {filteredChannels.length} selected
            </span>
          </div>

          {/* Channels List */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading channels...</span>
              </div>
            ) : (
              filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center space-x-3 rounded-lg border p-3 ${
                    !channel.is_member
                      ? "opacity-50"
                      : "hover:bg-muted/50 cursor-pointer"
                  }`}
                  onClick={() =>
                    channel.is_member && handleChannelToggle(channel.id)
                  }
                >
                  <Checkbox
                    checked={selectedChannels.has(channel.id)}
                    disabled={!channel.is_member}
                    onChange={() => handleChannelToggle(channel.id)}
                  />

                  <div className="flex items-center space-x-2">
                    {channel.is_private ? (
                      <Lock className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Hash className="text-muted-foreground h-4 w-4" />
                    )}
                    <span className="font-medium">#{channel.name}</span>
                  </div>

                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      {channel.purpose?.value || "No description"}
                    </span>
                    <div className="flex items-center space-x-2">
                      {channel.num_members && (
                        <Badge variant="secondary" className="text-xs">
                          {channel.num_members} members
                        </Badge>
                      )}
                      {!channel.is_member && (
                        <Badge variant="outline" className="text-xs">
                          Not a member
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedChannels.size === 0 || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `Save ${selectedChannels.size} Channels`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
