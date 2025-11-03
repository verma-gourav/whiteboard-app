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

export const getAllRooms = async (_req: AuthRequest, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        admin: { select: { name: true } },
        users: { select: { name: true } },
      },
    });

    res.status(200).json(rooms);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

export const getRoomBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        admin: { select: { name: true } },
      },
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch room" });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    await prisma.room.update({
      where: { slug },
      data: { users: { connect: { id: userId } } },
    });

    res.status(200).json({ message: "Joined room successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to join room" });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    await prisma.room.delete({ where: { slug } });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete room" });
  }
};
