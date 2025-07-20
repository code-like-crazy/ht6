"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Calendar, ArrowLeft } from "lucide-react";

const inviteCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Invite code must be exactly 6 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Invite code can only contain uppercase letters and numbers",
    ),
});

type InviteCodeFormData = z.infer<typeof inviteCodeSchema>;

type JoinOrganizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type MockOrganization = {
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  imageUrl?: string;
};

const JoinOrganizationModal = ({
  isOpen,
  onClose,
}: JoinOrganizationModalProps) => {
  const [step, setStep] = useState<"code" | "preview">("code");
  const [isLoading, setIsLoading] = useState(false);
  const [mockOrganization, setMockOrganization] =
    useState<MockOrganization | null>(null);

  const form = useForm<InviteCodeFormData>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Mock organizations for demo purposes
  const mockOrganizations: Record<string, MockOrganization> = {
    ABC123: {
      name: "TechCorp Solutions",
      description:
        "Leading software development company specializing in enterprise solutions and cloud infrastructure.",
      memberCount: 24,
      createdAt: "2023-08-15",
    },
    XYZ789: {
      name: "Design Studio Pro",
      description:
        "Creative agency focused on user experience design and brand development for modern businesses.",
      memberCount: 12,
      createdAt: "2024-01-20",
    },
    DEF456: {
      name: "StartupHub Inc",
      description:
        "Innovation hub connecting entrepreneurs, investors, and mentors to build the next generation of startups.",
      memberCount: 45,
      createdAt: "2023-11-03",
    },
  };

  const onSubmitCode = async (data: InviteCodeFormData) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if code exists in mock data
    const organization = mockOrganizations[data.code];

    if (organization) {
      setMockOrganization(organization);
      setStep("preview");
    } else {
      form.setError("code", {
        type: "manual",
        message: "Invalid invite code. Please check and try again.",
      });
    }

    setIsLoading(false);
  };

  const handleAcceptInvite = async () => {
    setIsLoading(true);

    // Simulate joining organization
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Close modal and reset
    handleClose();

    // TODO: Show success toast and refresh organizations
    console.log("Joined organization:", mockOrganization?.name);

    setIsLoading(false);
  };

  const handleClose = () => {
    setStep("code");
    setMockOrganization(null);
    form.reset();
    onClose();
  };

  const handleBack = () => {
    setStep("code");
    setMockOrganization(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden sm:max-w-lg">
        <AnimatePresence mode="wait">
          {step === "code" ? (
            <motion.div
              key="code-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <DialogHeader>
                <DialogTitle>Join Organization</DialogTitle>
                <DialogDescription>
                  Enter the 6-character invite code to join an organization.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitCode)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invite Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABC123"
                            className="text-center font-mono text-lg tracking-widest uppercase"
                            maxLength={6}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, "");
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-muted-foreground text-sm">
                    <p className="mb-2">Try these demo codes:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(mockOrganizations).map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => form.setValue("code", code)}
                          className="bg-secondary hover:bg-secondary/80 rounded px-2 py-1 font-mono text-xs transition-colors"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="preview-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="h-auto p-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  Join Organization
                </DialogTitle>
                <DialogDescription>
                  Review the organization details before joining.
                </DialogDescription>
              </DialogHeader>

              {mockOrganization && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-4"
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                          <span className="text-primary text-lg font-bold">
                            {mockOrganization.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {mockOrganization.name}
                          </CardTitle>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {mockOrganization.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{mockOrganization.memberCount} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Created{" "}
                            {new Date(
                              mockOrganization.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-secondary/50 rounded-lg p-4">
                    <h4 className="mb-2 font-medium">What happens next?</h4>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li>
                        • You&apos;ll become a member of this organization
                      </li>
                      <li>
                        • You&apos;ll have access to organization projects
                      </li>
                      <li>• You can collaborate with other team members</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button onClick={handleAcceptInvite} disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Accept Invite
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default JoinOrganizationModal;
