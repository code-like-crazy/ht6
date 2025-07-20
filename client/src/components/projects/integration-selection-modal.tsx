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

  const getCategoryColor = (categoryId: IntegrationCategory) => {
    const category = integrationCategories.find((cat) => cat.id === categoryId);
    return category?.color || "gray";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Connect Integration</DialogTitle>
          <DialogDescription>
            Choose an integration to connect to your project. This will allow
            Loominal to access and analyze data from these tools.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
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
          <div className="grid max-h-96 grid-cols-1 gap-4 overflow-y-auto">
            {filteredIntegrations.map((integration) => {
              const isConnecting = connectingIntegration === integration.id;

              return (
                <div
                  key={integration.id}
                  className="border-border/60 bg-background/50 hover:bg-background/70 rounded-xl border p-4 transition-all hover:shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                        <integration.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-foreground text-sm font-semibold">
                          {integration.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`mt-1 text-xs bg-${getCategoryColor(
                            integration.category,
                          )}-100 text-${getCategoryColor(
                            integration.category,
                          )}-800 dark:bg-${getCategoryColor(
                            integration.category,
                          )}-900/20 dark:text-${getCategoryColor(
                            integration.category,
                          )}-400`}
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

                  <p className="text-muted-foreground mb-3 text-xs">
                    {integration.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-muted-foreground mb-2 text-xs">
                      Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
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
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <ExternalLink className="h-3 w-3" />
                      {integration.authType === "oauth" ? "OAuth" : "API Key"}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration)}
                      disabled={isConnecting}
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
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                No integrations found for the selected category.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
