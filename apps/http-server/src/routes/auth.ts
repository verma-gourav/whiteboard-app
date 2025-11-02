import { Router } from "express";
import { signinSchema, signupSchema } from "@repo/common";
import { prisma } from "@repo/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";

const router: Router = Router();

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error,
    });
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

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
      },
    });

    res.status(201).json({ message: "Signup successfull" });
  } catch (err: any) {
    console.error("Signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error,
    });
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

    res.status(200).json({ message: "Sigin successfull", token });
  } catch (err: any) {
    console.error("Signin error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
