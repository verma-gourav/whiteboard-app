"use client";

import { ToolType } from "@/board/components/Toolbar";
import React, { useCallback, useEffect, useState } from "react";

const useCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  activeTool: ToolType
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [savedImage, setSavedImage] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        setCtx(context);
      }
    }
  }, [canvasRef]);

  const getMousePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [canvasRef]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    const pos = getMousePos(e);
    setStartPos(pos);
    setIsDrawing(true);

    if (activeTool === "pencil" || activeTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else {
      if (ctx.canvas) {
        const imageData = ctx.getImageData(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );
        setSavedImage(imageData);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !startPos) return;

    const pos = getMousePos(e);
    const { x, y } = startPos;

    // restore canvas
    if (activeTool !== "pencil" && activeTool !== "eraser" && savedImage) {
      ctx.putImageData(savedImage, 0, 0);
      ctx.beginPath();
    }

    switch (activeTool) {
      case "pencil":
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.moveTo(pos.x, pos.y);
        break;

      case "eraser":
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 12;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.moveTo(pos.x, pos.y);
        ctx.globalCompositeOperation = "source-over";
        break;

      case "rectangle":
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.strokeRect(x, y, pos.x - x, pos.y - y);
        break;

      case "circle":
        ctx.lineWidth = 2;
        const radius = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case "line":
        ctx.lineWidth = 2;
        ctx.moveTo(x, y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;

      case "diamond":
        ctx.lineWidth = 2;
        ctx.moveTo(x + (pos.x - x) / 2, y);
        ctx.lineTo(pos.x, y + (pos.y - y) / 2);
        ctx.lineTo(x + (pos.x - x) / 2, pos.y);
        ctx.lineTo(x, y + (pos.y - y) / 2);
        ctx.closePath();
        ctx.stroke();
        break;

      default:
        break;
    }
  };

  const handleMouseUp = () => {
    if (!ctx) return;

    // save current canvas
    if (activeTool !== "pencil" && activeTool !== "eraser") {
      if (ctx.canvas) {
        const imageData = ctx.getImageData(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );
        setSavedImage(imageData);
      }
    }

    setIsDrawing(false);
    setStartPos(null);
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setSavedImage(null);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
  };
};

export default useCanvas;
