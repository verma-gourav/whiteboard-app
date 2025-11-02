import { z } from "zod";

export const signupSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6),
  name: z.string().min(3),
});

export const signinSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6),
});

export const roomSchema = z.object({
  name: z.string().min(3).max(30),
});
