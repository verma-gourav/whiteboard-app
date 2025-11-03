import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { prisma } from "@repo/database";

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params;
  const userId = req.user?.id;

  const room = await prisma.room.findUnique({ where: { slug } });
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (room.adminId !== userId)
    return res.status(403).json({ message: "Not authorized" });

  next();
};
