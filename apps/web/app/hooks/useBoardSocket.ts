"use client";

import { useEffect, useRef } from "react";

interface UseBoardSocketProps {
  slug: string;
  token: string;
  onBoardUpdate?: (data: any, userId: string) => void;
}

const useBoardSocket = ({
  slug,
  token,
  onBoardUpdate,
}: UseBoardSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !slug) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WS server");
      if (slug) ws.send(JSON.stringify({ type: "JOIN_ROOM", slug }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("WS Message", msg);

      if (msg.type === "BOARD_UPDATE" && onBoardUpdate) {
        onBoardUpdate(msg.data, msg.user);
      } else if (msg.type === "JOIN_SUCCESS") {
        console.log(`Joined room: ${msg.slug}`);
      } else if (msg.type === "ERROR") {
        console.error("WS Error:", msg.message);
      }
    };

    ws.onclose = () => {
      console.log("WS connection closed");
    };

    ws.onerror = (err) => {
      console.log("WS error", err);
    };

    return () => {
      try {
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(JSON.stringify({ type: "LEAVE_ROOM", slug }));
          socketRef.current.close();
        } else if (socketRef.current) {
          socketRef.current.close();
        }
      } catch (err) {
        console.warn("WS cleanup error", err);
        try {
          socketRef.current?.close();
        } catch {}
      }
    };
  }, [slug, token]);

  const sendBoardEvent = (data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "BOARD_EVENT",
          slug,
          data,
        })
      );
    } else {
      console.warn("WS not open send board event", data);
    }
  };

  return { sendBoardEvent };
};

export default useBoardSocket;
