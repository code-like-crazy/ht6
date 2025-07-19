"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Loader2,
  Building2,
  Briefcase,
  Code,
  Palette,
  Rocket,
  Users,
  Zap,
  Globe,
  Heart,
  Star,
  Target,
  Lightbulb,
  Shield,
  Cpu,
  Database,
  Cloud,
  Smartphone,
  Camera,
  Music,
  LucideIcon,
} from "lucide-react";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
});

// Available icons for organizations
const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: "building2", icon: Building2 },
  { name: "briefcase", icon: Briefcase },
  { name: "code", icon: Code },
  { name: "palette", icon: Palette },
  { name: "rocket", icon: Rocket },
  { name: "users", icon: Users },
  { name: "zap", icon: Zap },
  { name: "globe", icon: Globe },
  { name: "heart", icon: Heart },
  { name: "star", icon: Star },
  { name: "target", icon: Target },
  { name: "lightbulb", icon: Lightbulb },
  { name: "shield", icon: Shield },
  { name: "cpu", icon: Cpu },
  { name: "database", icon: Database },
  { name: "cloud", icon: Cloud },
  { name: "smartphone", icon: Smartphone },
  { name: "camera", icon: Camera },
  { name: "music", icon: Music },
];

type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

type CreateOrganizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateOrganizationModal = ({
  isOpen,
  onClose,
}: CreateOrganizationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create organization");
      }

      const organization = await response.json();

      // Close modal and reset form
      onClose();
      form.reset();

      // Refresh the page to show the new organization
      router.refresh();
    } catch (error) {
      console.error("Error creating organization:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (
      !form.getValues("slug") ||
      form.formState.touchedFields.slug === undefined
    ) {
      form.setValue("slug", generateSlug(name));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
                      {...field}
                      onChange={(e) => {
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="acme-inc"
                      {...field}
                      onChange={(e) => {
                        form.setValue("slug", generateSlug(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Optional)</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-6 gap-2">
                      {availableIcons.map(({ name, icon: IconComponent }) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => field.onChange(name)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                            field.value === name
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50 hover:bg-secondary"
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
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
                      placeholder="A brief description of your organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Organization
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationModal;
