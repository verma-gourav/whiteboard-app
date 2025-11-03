import { Router } from "express";
import { createRoom } from "../controllers/roomController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.post("/", authMiddleware, createRoom);
// router.get("/", getAllRooms);
// router.get("/:slug", getRoomBySlug);
// router.post("/:slug/join", joinRoom);
// router.delete("/:slug", deleteRoom);

export default router;
