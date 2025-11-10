import { Request, Response } from "express";
import { signinSchema, signupSchema } from "@repo/common";
import { prisma } from "@repo/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";

export const signup = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const data = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(201).json({ message: "Signup successful", token });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const data = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Signin successful",
      token,
    });
  } catch (err: any) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
