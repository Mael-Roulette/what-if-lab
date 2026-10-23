import * as z from "zod";

export const userSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = userSchema.extend({
  name: z.string().trim().min(1, "Please enter your name."),
});

export type FieldErrors = Partial<
  Record<"name" | "email" | "password", string[]>
>;