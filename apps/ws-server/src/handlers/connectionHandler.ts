import { WebSocket } from "ws";
import url from "url";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";
import { handleMessage } from "./messageHandler";

export const clients = new Map<string, WebSocket>();

export const handleConnection = (ws: WebSocket, req: any) => {
  const { query } = url.parse(req.url, true);
  const token = query?.token as string;

  if (!token) {
    ws.close(4001, "Token required");
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET!) as {
      userId: string;
    };
    (ws as any).user = user;
    clients.set(user.userId, ws);

    console.log(`User connected: ${user.userId}`);

    ws.on("message", (msg) => handleMessage(ws, msg.toString()));
    ws.on("close", () => {
      clients.delete(user.userId);
      console.log(`User disconnected: ${user.userId}`);
    });
  } catch (err: any) {
    ws.close(4002, "Invalid token");
  }
};
