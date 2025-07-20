"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  availableIntegrations,
  integrationCategories,
  Integration,
  IntegrationCategory,
} from "@/config/integrations";
import { ExternalLink, Loader2 } from "lucide-react";

interface IntegrationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | null;
}

export default function IntegrationSelectionModal({
  isOpen,
  onClose,
  projectId,
}: IntegrationSelectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    IntegrationCategory | "all"
  >("all");
  const [connectingIntegration, setConnectingIntegration] = useState<
    string | null
  >(null);

  const filteredIntegrations = availableIntegrations.filter(
    (integration) =>
      selectedCategory === "all" || integration.category === selectedCategory,
  );

  const handleConnect = async (integration: Integration) => {
    if (!projectId) return;

    setConnectingIntegration(integration.id);

    try {
      if (integration.id === "github") {
        // Start GitHub OAuth flow
        const response = await fetch(
          `/api/integrations/github/auth?projectId=${projectId}`,
          {
            method: "GET",
          },
        );

        if (response.ok) {
          const { authUrl } = await response.json();
          // Redirect to GitHub OAuth
          window.location.href = authUrl;
        } else {
          throw new Error("Failed to initiate GitHub OAuth");
        }
      } else if (integration.id === "slack") {
        // Start Slack OAuth flow
        const response = await fetch(
          `/api/integrations/slack/auth?projectId=${projectId}`,
          {
            method: "GET",
          },
        );

        if (response.ok) {
          const { authUrl } = await response.json();
          // Redirect to Slack OAuth
          window.location.href = authUrl;
        } else {
          throw new Error("Failed to initiate Slack OAuth");
        }
      } else {
        // Handle other integrations (API key based, etc.)
        console.log(`Connecting ${integration.name}...`);
        // TODO: Implement other integration flows
      }
    } catch (error) {
      console.error(`Error connecting ${integration.name}:`, error);
      setConnectingIntegration(null);
    }
  };

  const getCategoryBadgeClass = (categoryId: IntegrationCategory) => {
    const category = integrationCategories.find((cat) => cat.id === categoryId);
    const color = category?.color || "gray";

    // Return solid background classes with good contrast
    switch (color) {
      case "blue":
        return "bg-blue-600 text-white";
      case "green":
        return "bg-green-600 text-white";
      case "purple":
        return "bg-purple-600 text-white";
      case "orange":
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full overflow-hidden sm:max-w-4xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl">Connect Integration</DialogTitle>
          <DialogDescription className="text-base">
            Choose an integration to connect to your project. This will allow
            Loominal to access and analyze data from these tools.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {integrationCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid max-h-[50vh] grid-cols-1 gap-6 overflow-y-auto pr-2">
            {filteredIntegrations.map((integration) => {
              const isConnecting = connectingIntegration === integration.id;

              return (
                <div
                  key={integration.id}
                  className="border-border bg-background/50 hover:bg-background/70 rounded-xl border p-6 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                        <integration.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-foreground text-base font-semibold">
                          {integration.name}
                        </h3>
                        <Badge
                          className={`mt-2 border-0 text-xs ${getCategoryBadgeClass(
                            integration.category,
                          )}`}
                        >
                          {
                            integrationCategories.find(
                              (cat) => cat.id === integration.category,
                            )?.label
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {integration.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-muted-foreground mb-3 text-sm font-medium">
                      Features:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {integration.features.slice(0, 3).map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {integration.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{integration.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4" />
                      {integration.authType === "oauth" ? "OAuth" : "API Key"}
                    </div>
                    <Button
                      onClick={() => handleConnect(integration)}
                      disabled={isConnecting}
                      className="px-6"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-base">
                No integrations found for the selected category.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
