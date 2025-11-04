import { WebSocketServer } from "ws";
import { WS_PORT } from "@repo/backend-common";
import { handleConnection } from "./handlers/connectionHandler";

const wss = new WebSocketServer({ port: Number(WS_PORT) });

wss.on("connection", (ws, req) => handleConnection(ws, req));

console.log(`WebSocket server running on port ${WS_PORT}`);
