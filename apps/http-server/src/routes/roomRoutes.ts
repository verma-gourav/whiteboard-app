import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomBySlug,
  joinRoom,
} from "../controllers/roomController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router: Router = Router();

router.post("/", authMiddleware, createRoom);
router.get("/", getAllRooms);
router.get("/:slug", getRoomBySlug);
router.post("/:slug/join", authMiddleware, joinRoom);
router.delete("/:slug", authMiddleware, adminMiddleware, deleteRoom);

export default router;
