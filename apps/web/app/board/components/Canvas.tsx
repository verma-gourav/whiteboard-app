"use client";

import useCanvas from "@/hooks/useCanvas";
import { useEffect, useRef } from "react";
import { ToolType } from "./Toolbar";

interface CanvasProps {
  activeTool: ToolType;
}

const Canvas = ({ activeTool }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { handleMouseDown, handleMouseMove, handleMouseUp, clearCanvas } =
    useCanvas(canvasRef, activeTool);

  // Resize canvas to fill parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // save current content
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(imageData, 0, 0);
      } else {
        canvas.width = width;
        canvas.height = height;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={parentRef}
      className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Canvas;
