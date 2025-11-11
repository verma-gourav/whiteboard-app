"use client";

import useCanvas from "@/hooks/useCanvas";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { ToolType } from "./Toolbar";

interface CanvasProps {
  mode?: "local" | "collab";
  activeTool: ToolType;
  onAction?: (action: any) => void;
  remoteAction?: any;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ activeTool, mode = "local", onAction, remoteAction }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const parentRef = useRef<HTMLDivElement | null>(null);

    const {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      clearCanvas,
      applyRemoteAction,
    } = useCanvas(canvasRef, activeTool);

    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

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

    useEffect(() => {
      if (mode === "collab" && remoteAction) {
        applyRemoteAction(remoteAction);
      }
    }, [remoteAction, mode, applyRemoteAction]);

    // attach drawing event listeners
    const handleDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleMouseDown(e);
    };
    const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleMouseMove(e);
    };
    const handleUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const action = handleMouseUp(e);
      if (mode === "collab" && action && onAction) {
        onAction(action);
      }
    };

    return (
      <div
        ref={parentRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(#7C74A7 1px, transparent 1px)`,
          backgroundSize: "25px 25px",
        }}
        data-darkmode-background="radial-gradient(#ff8c42 1px, transparent 1px)"
      >
        <canvas
          ref={canvasRef}
          className="cursor-crosshair"
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
        />
      </div>
    );
  }
);

export default Canvas;
