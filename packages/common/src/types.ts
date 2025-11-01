import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string(),
  name: z.string(),
});

export const signinSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
});

export const roomSchema = z.object({
  name: z.string().min(3).max(20),
});
