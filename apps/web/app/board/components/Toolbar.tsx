"use client";

import { JSX } from "react";
import {
  HandIcon,
  SelectionIcon,
  SquareIcon,
  DiamondIcon,
  CircleIcon,
  ArrowIcon,
  LineIcon,
  PencilIcon,
  ImageIcon,
  EraserIcon,
} from "@/components/icons";
import { Button } from "@/components/ui";

export type ToolType =
  | "hand"
  | "select"
  | "rectangle"
  | "diamond"
  | "circle"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "image"
  | "eraser";

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const Toolbar = ({ activeTool, onToolChange }: ToolbarProps) => {
  const tools: { type: ToolType; icon?: JSX.Element; label?: string }[] = [
    { type: "hand", icon: <HandIcon /> },
    { type: "select", icon: <SelectionIcon /> },
    { type: "rectangle", icon: <SquareIcon /> },
    { type: "diamond", icon: <DiamondIcon /> },
    { type: "circle", icon: <CircleIcon /> },
    { type: "arrow", icon: <ArrowIcon /> },
    { type: "line", icon: <LineIcon /> },
    { type: "pencil", icon: <PencilIcon /> },
    { type: "text", label: "A" },
    { type: "image", icon: <ImageIcon /> },
    { type: "eraser", icon: <EraserIcon /> },
  ];

  return (
    <div className="inline-flex justify-between h-auto border border-gray-300 shadow-sm rounded-xl transition-all duration-300">
      {tools.map((tool) => (
        <Button
          key={tool.type}
          variant="ghost"
          size="md"
          icon={tool.icon}
          text={tool.label}
          onClick={() => onToolChange(tool.type)}
          className={`${activeTool === tool.type ? "bg-light-secondary dark:bg-dark-secondary" : ""}`}
        />
      ))}
    </div>
  );
};

export default Toolbar;
