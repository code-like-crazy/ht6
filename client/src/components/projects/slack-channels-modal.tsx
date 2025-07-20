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
      <DialogContent className="max-h-[90vh] w-full overflow-hidden p-4 sm:max-w-4xl sm:p-6">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl">
            Select Slack Channels
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Choose which channels from {connectionName} you want Loominal to
            access for context and knowledge extraction.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 sm:space-y-8">
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={isLoading}
              className="w-full sm:w-auto"
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
            <span className="text-muted-foreground text-center text-sm sm:text-left">
              {selectedChannels.size} of {filteredChannels.length} selected
            </span>
          </div>

          {/* Channels List */}
          <div className="grid max-h-[40vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:max-h-[50vh] sm:gap-4 sm:pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                <span className="ml-2 text-sm sm:text-base">
                  Loading channels...
                </span>
              </div>
            ) : (
              filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  className={`border-border bg-background/50 hover:bg-background/70 rounded-lg border p-4 transition-all hover:shadow-md sm:rounded-xl sm:p-6 ${
                    !channel.is_member ? "opacity-50" : "cursor-pointer"
                  }`}
                  onClick={() =>
                    channel.is_member && handleChannelToggle(channel.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                      <Checkbox
                        checked={selectedChannels.has(channel.id)}
                        disabled={!channel.is_member}
                        onChange={() => handleChannelToggle(channel.id)}
                        className="mt-1 flex-shrink-0"
                      />

                      <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
                        <div className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
                          {channel.is_private ? (
                            <Lock className="text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <Hash className="text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-foreground truncate text-sm font-semibold sm:text-base">
                            #{channel.name}
                          </h3>
                          {channel.purpose?.value && (
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed sm:text-sm">
                              {channel.purpose.value.length > 80
                                ? `${channel.purpose.value.substring(0, 80)}...`
                                : channel.purpose.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-2 flex flex-col items-end gap-1 sm:gap-2">
                      {channel.num_members && (
                        <Badge variant="secondary" className="text-xs">
                          {channel.num_members} members
                        </Badge>
                      )}
                      {!channel.is_member && (
                        <Badge variant="outline" className="text-xs">
                          Not member
                        </Badge>
                      )}
                      {channel.is_private && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredChannels.length === 0 && !isLoading && (
            <div className="py-8 text-center sm:py-12">
              <p className="text-muted-foreground text-sm sm:text-base">
                No channels found matching your search.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end sm:space-x-3 sm:pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedChannels.size === 0 || isSaving}
              className="w-full px-6 sm:w-auto"
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
