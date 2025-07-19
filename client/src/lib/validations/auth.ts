import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address").trim(),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
