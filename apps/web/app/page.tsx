"use client";

import { useState } from "react";
import Toolbar, { ToolType } from "@/board/components/Toolbar";
import Canvas from "@/board/components/Canvas";
import Share from "@/board/components/Share";
import Export from "@/board/components/Export";

export default function Page() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas activeTool={activeTool} />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>
      </div>

      <div className="absolute top-4 right-4 flex  gap-2 pointer-events-none">
        <div className="inline-flex justify-evenly items-center gap-2 pointer-events-auto">
          <Export />
          <Share />
        </div>
      </div>
    </div>
  );
}
