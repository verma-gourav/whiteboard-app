import { roomSchema } from "@repo/common";
import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { prisma } from "@repo/database";

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = roomSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error,
      });
    }

    const slug = parsed.data.slug;
    const adminId = req.user?.id;

    if (!adminId) return res.status(401).json({ message: "Unauthorized" });

    const existingRoom = await prisma.room.findUnique({ where: { slug } });
    if (existingRoom)
      return res.status(400).json({ message: "Room already exist" });

    const room = await prisma.room.create({
      data: {
        slug,
        adminId,
      },
    });

    res.status(201).json({ message: "Room created", room });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create room" });
  }
};
