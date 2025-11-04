import { WebSocket } from "ws";
import { prisma } from "@repo/database";

export const rooms = new Map<string, Set<WebSocket>>();

export const handleMessage = async (ws: WebSocket, raw: string) => {
  try {
    const msg = JSON.parse(raw);
    const user = (ws as any).user;

    switch (msg.type) {
      case "JOIN_ROOM":
        if (!rooms.has(msg.slug)) {
          ws.send(JSON.stringify({ type: "ERROR", message: "Room not found" }));
          break;
        }

        rooms.get(msg.slug)!.add(ws);
        ws.send(JSON.stringify({ type: "JOIN_SUCCESS", slug: msg.slug }));
        console.log(`${user.userId} joined ${msg.slug}`);
        break;

      case "BOARD_EVENT":
        await prisma.boardEvents.create({
          data: {
            data: msg.data,
            room: { connect: { slug: msg.slug } },
            user: { connect: { id: user.id } },
          },
        });

        const peers = rooms.get(msg.slug);
        if (peers) {
          peers.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "BOARD_UPDATE",
                  user: user.id,
                  data: msg.data,
                })
              );
            }
          });
        }
        break;

      case "LEAVE_ROOM":
        rooms.get(msg.slug)?.delete(ws);
        ws.send(JSON.stringify({ type: "LEFT_ROOM", slug: msg.slug }));
        break;

      default:
        ws.send(
          JSON.stringify({ type: "ERROR", message: "Unknown event type" })
        );
    }
  } catch (err: any) {
    console.error("Message error", err);
  }
};
