"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProjectSchema,
  CreateProjectFormData,
} from "@/lib/validations/project";
import { OrganizationWithRole } from "@/server/services/organization";
import { Building2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: OrganizationWithRole[];
  selectedOrganization: string;
  user: User;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  organizations,
  selectedOrganization,
}: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getIconComponent = (iconName?: string | null) => {
    if (!iconName) return Building2;

    // Convert icon name to PascalCase if needed
    const formattedIconName =
      iconName.charAt(0).toUpperCase() + iconName.slice(1);

    // Try to get the icon component from lucide-react
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lucideIcons = LucideIcons as any;
      const IconComponent =
        lucideIcons[formattedIconName] || lucideIcons[iconName];

      // Check if it's a valid React component
      if (typeof IconComponent === "function") {
        return IconComponent;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn(`Icon "${iconName}" not found in lucide-react`);
    }

    return Building2;
  };

  // Get the default organization ID for the selected organization
  const getDefaultOrganizationId = () => {
    if (selectedOrganization === "all" && organizations.length > 0) {
      return organizations[0].id;
    }
    if (selectedOrganization !== "all") {
      return parseInt(selectedOrganization);
    }
    return organizations.length > 0 ? organizations[0].id : undefined;
  };

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: getDefaultOrganizationId(),
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const project = await response.json();

      form.reset();
      onClose();

      // Redirect to the new project page
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your team&apos;s knowledge and
            integrations.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the project"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => {
                        const IconComponent = getIconComponent(org.icon);
                        return (
                          <SelectItem key={org.id} value={org.id.toString()}>
                            <div className="flex items-center gap-2">
                              {org.icon && (
                                <IconComponent className="h-4 w-4" />
                              )}
                              {org.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
