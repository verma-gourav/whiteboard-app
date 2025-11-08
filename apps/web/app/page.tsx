"use client";

import { useState } from "react";
import Toolbar, { ToolType } from "@/board/components/Toolbar";
import Canvas from "@/board/components/Canvas";

export default function Page() {
  const [activeTool, setActiveTool] = useState<ToolType>("pencil");
  return (
    <div>
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
      <Canvas activeTool={activeTool} />
    </div>
  );
}
