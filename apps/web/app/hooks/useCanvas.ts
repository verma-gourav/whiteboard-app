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

    // Text Tool
    if (activeTool === "text") {
      const text = prompt("Enter text:");
      if (text && ctx) {
        ctx.fillStyle = "#a8a5ff";
        ctx.font = "30px Arial";
        ctx.fillText(text, pos.x, pos.y);
      }
      setIsDrawing(false);
    }

    // Image Tool
    if (activeTool === "image") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, pos.x, pos.y, 150, 150); // fixed size for now
        };
        img.src = URL.createObjectURL(file);
      };
      input.click();
      setIsDrawing(false);
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
        ctx.strokeStyle = "#a8a5ff";
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
        ctx.strokeStyle = "#a8a5ff";
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

      case "arrow":
        ctx.lineWidth = 2;
        drawArrow(ctx, x, y, pos.x, pos.y);
        break;

      default:
        break;
    }
  };

  const handleMouseUp = (e?: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx || !startPos) return;

    const pos = e ? getMousePos(e) : startPos;
    const { x, y } = startPos;

    let action: any = null;

    switch (activeTool) {
      case "pencil":
      case "eraser":
        action = { type: activeTool, x, y, toX: pos.x, toY: pos.y };
        break;
      case "rectangle":
      case "circle":
      case "line":
      case "diamond":
      case "arrow":
        action = { type: activeTool, from: { x, y }, to: pos };
        break;
    }

    setIsDrawing(false);
    setStartPos(null);
    return action;
  };

  // apply incoming remote action
  const applyRemoteAction = (action: any) => {
    if (!ctx) return;
    switch (action.type) {
      case "pencil":
        ctx.beginPath();
        ctx.moveTo(action.x, action.y);
        ctx.lineTo(action.toX, action.toY);
        ctx.stroke();
        break;

      case "rectangle":
        ctx.strokeRect(
          action.from.x,
          action.from.y,
          action.to.x - action.from.x,
          action.to.y - action.from.y
        );
        break;
      case "circle":
        const radius = Math.sqrt(
          (action.to.x - action.from.x) ** 2 +
            (action.to.y - action.from.y) ** 2
        );
        ctx.beginPath();
        ctx.arc(action.from.x, action.from.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(action.from.x, action.from.y);
        ctx.lineTo(action.to.x, action.to.y);
        ctx.stroke();
        break;
      case "arrow":
        drawArrow(ctx, action.from.x, action.from.y, action.to.x, action.to.y);
        break;
      case "text":
        ctx.fillText(action.text, action.x, action.y);
        break;
    }
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setSavedImage(null);
    }
  };

  // Draw arrow helper
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) => {
    const headlen = 20; // length of arrow head
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    applyRemoteAction,
  };
};

export default useCanvas;
