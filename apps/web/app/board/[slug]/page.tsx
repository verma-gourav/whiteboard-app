"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import Toolbar, { ToolType } from "@/board/components/Toolbar";
import useBoardSocket from "@/hooks/useBoardSocket";
import Canvas from "@/board/components/Canvas";
import Export from "@/board/components/Export";

export default function CollabBoardPage() {
  const { slug } = useParams();
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [remoteAction, setRemoteAction] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Signin is required to join session");
    return;
  }

  const { sendBoardEvent } = useBoardSocket({
    slug: slug as string,
    token,
    onBoardUpdate: (data, userId) => {
      console.log("Board update from:", userId);
      setRemoteAction(data);
    },
  });

  const handleAction = (action: any) => {
    sendBoardEvent(action);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas
        ref={canvasRef}
        activeTool={activeTool}
        mode="collab"
        onAction={handleAction}
        remoteAction={remoteAction}
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>
      </div>

      <div className="absolute bg-light dark:bg-dark top-4 right-4 flex  gap-2 pointer-events-none">
        <div className="inline-flex justify-evenly items-center gap-2 pointer-events-auto">
          <Export canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
