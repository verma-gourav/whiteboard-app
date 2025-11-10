"use client";

import { DownloadIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import React from "react";

interface ExportProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const Export = ({ canvasRef }: ExportProps) => {
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // temporary canvas for exporting
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // body background color
    const bodyStyles = getComputedStyle(document.body);
    const bgColor = bodyStyles.backgroundColor || "#ffffff";

    // temporary canvas with background color
    tempCtx.fillStyle = bgColor;
    tempCtx.fillRect(0, 0, canvas.width, canvas.height);

    // actual canvas on top
    tempCtx.drawImage(canvas, 0, 0);

    const img = tempCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = img;
    link.download = `whiteboard-${Date.now()}.png`;
    link.click();
  };
  return (
    <Button
      variant="ghost"
      size="md"
      icon={<DownloadIcon />}
      onClick={handleExport}
      className=" border border-gray-300"
    />
  );
};

export default Export;
