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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Search,
  Star,
  GitFork,
  Lock,
  Globe,
  Loader2,
  Check,
  Download,
  Link,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  connectionName: string;
}

export default function GitHubRepositoryModal({
  isOpen,
  onClose,
  projectId,
  connectionName,
}: GitHubRepositoryModalProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
  const [connectedRepos, setConnectedRepos] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [syncingRepos, setSyncingRepos] = useState<Set<number>>(new Set());

  // Load connected repositories when modal opens
  useEffect(() => {
    if (isOpen && projectId) {
      loadConnectedRepositories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, projectId]);

  const loadConnectedRepositories = async () => {
    try {
      const response = await fetch(
        `/api/integrations/github/repositories?projectId=${projectId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch connected repositories");
      }

      const data = await response.json();
      // Set connected repos from the selected repositories
      const connected = data.repositories.filter((repo: Repository) =>
        data.selectedRepositories.includes(repo.id),
      );
      setConnectedRepos(connected);
      setSelectedRepoIds(data.selectedRepositories);
    } catch (error) {
      console.error("Error fetching connected repositories:", error);
      toast.error("Failed to fetch connected repositories");
    }
  };

  const fetchRepositories = async () => {
    if (hasInitialLoad) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/integrations/github/repositories?projectId=${projectId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepositories(data.repositories);
      setSelectedRepoIds(data.selectedRepositories);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error("Failed to fetch repositories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoToggle = (repoId: number) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/integrations/github/repositories?projectId=${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repositoryIds: selectedRepoIds,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save repository selection");
      }

      const data = await response.json();
      toast.success(`Successfully selected ${data.selectedCount} repositories`);
      onClose();
    } catch (error) {
      console.error("Error saving repositories:", error);
      toast.error("Failed to save repository selection");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFetchRepositories = async () => {
    setHasInitialLoad(true);
    await fetchRepositories();
  };

  const handleSyncRepository = async (repositoryId: number) => {
    setSyncingRepos((prev) => new Set(prev).add(repositoryId));

    try {
      const response = await fetch("/api/integrations/github/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          repositoryId: repositoryId.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync repository");
      }

      const data = await response.json();
      toast.success(data.message || "Repository synced successfully!");
    } catch (error) {
      console.error("Error syncing repository:", error);
      toast.error("Failed to sync repository. Please try again.");
    } finally {
      setSyncingRepos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(repositoryId);
        return newSet;
      });
    }
  };

  const renderRepositoryCard = (
    repo: Repository,
    isSelected: boolean,
    onToggle: (id: number) => void,
    showSyncButton = false,
  ) => (
    <div
      key={repo.id}
      className={`rounded-lg border p-5 transition-all hover:shadow-md ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/60 bg-background/50 hover:bg-background/70"
      } ${!showSyncButton ? "cursor-pointer" : ""}`}
      onClick={!showSyncButton ? () => onToggle(repo.id) : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {repo.private ? (
                <Lock className="text-muted-foreground h-4 w-4" />
              ) : (
                <Globe className="text-muted-foreground h-4 w-4" />
              )}
              <h3 className="text-base font-semibold">{repo.name}</h3>
            </div>
            {isSelected && !showSyncButton && (
              <Check className="text-primary h-5 w-5" />
            )}
          </div>

          {repo.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {repo.description}
            </p>
          )}

          <div className="text-muted-foreground flex items-center gap-5 text-sm">
            {repo.language && (
              <Badge variant="secondary" className="px-2 py-1 text-xs">
                {repo.language}
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              <span>{repo.forks_count}</span>
            </div>
            <span>Updated {formatDate(repo.updated_at)}</span>
          </div>
        </div>

        {showSyncButton && (
          <div className="ml-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleSyncRepository(repo.id);
              }}
              disabled={syncingRepos.has(repo.id)}
              className="min-w-[100px]"
            >
              {syncingRepos.has(repo.id) ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Sync
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-5xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <Github className="h-6 w-6" />
            GitHub Repositories - {connectionName}
          </DialogTitle>
          <DialogDescription className="mt-2 text-base">
            Manage your GitHub repository connections for this project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connections" className="flex flex-col space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="connections"
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Connections ({connectedRepos.length})
            </TabsTrigger>
            <TabsTrigger
              value="new-connection"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              New Connection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            {connectedRepos.length === 0 ? (
              <div className="py-12 text-center">
                <Github className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">
                  No repositories connected
                </h3>
                <p className="text-muted-foreground mt-2">
                  Connect repositories to enable AI-powered insights and code
                  analysis.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    // Switch to new connection tab
                    const newConnectionTab = document.querySelector(
                      '[value="new-connection"]',
                    ) as HTMLElement;
                    newConnectionTab?.click();
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Connect Repositories
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Connected Repositories
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Click &ldquo;Sync&rdquo; to process repository files and
                      create embeddings for AI chat
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {connectedRepos.length} connected
                  </Badge>
                </div>
                <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
                  {connectedRepos.map((repo) =>
                    renderRepositoryCard(repo, true, () => {}, true),
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new-connection" className="space-y-4">
            {!hasInitialLoad ? (
              <div className="py-12 text-center">
                <Download className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">
                  Fetch Your Repositories
                </h3>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md">
                  Load your GitHub repositories to select which ones to connect
                  to this project. We&apos;ll show your 30 most recently updated
                  repositories.
                </p>
                <Button
                  className="mt-6"
                  onClick={handleFetchRepositories}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching Repositories...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Fetch Repositories
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-11 text-base"
                  />
                </div>

                {/* Repository List */}
                <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-muted-foreground ml-2 text-sm">
                        Loading repositories...
                      </span>
                    </div>
                  ) : filteredRepositories.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground text-sm">
                        {searchQuery
                          ? "No repositories match your search"
                          : "No repositories found"}
                      </p>
                    </div>
                  ) : (
                    filteredRepositories.map((repo) => {
                      const isSelected = selectedRepoIds.includes(repo.id);
                      return renderRepositoryCard(
                        repo,
                        isSelected,
                        handleRepoToggle,
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground text-sm">
                        {selectedRepoIds.length} repositories selected
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Showing your 30 most recently updated repositories
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Selection"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
