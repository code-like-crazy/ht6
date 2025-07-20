import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(255, "Project name must be less than 255 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  organizationId: z.number().int().positive("Organization ID is required"),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
