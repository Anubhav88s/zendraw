import {
  Circle,
  Pencil,
  RectangleHorizontalIcon,
  Minus,
  ArrowRight,
  Diamond,
  Type,
  Eraser,
  MousePointer2,
} from "lucide-react";
import { IconButton } from "./IconButton";
import { Tool } from "@/draw/tools";

export function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex gap-1 p-1.5 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
        <IconButton
          icon={<MousePointer2 />}
          onClick={() => setSelectedTool("selection")}
          activated={selectedTool === "selection"}
          shortcut="1"
        />
        <div className="w-[1px] bg-white/10 mx-1 self-stretch" />
        <IconButton
          icon={<RectangleHorizontalIcon />}
          onClick={() => setSelectedTool("rect")}
          activated={selectedTool === "rect"}
          shortcut="2"
        />
        <IconButton
          icon={<Diamond />}
          onClick={() => setSelectedTool("diamond")}
          activated={selectedTool === "diamond"}
          shortcut="3"
        />
        <IconButton
          icon={<Circle />}
          onClick={() => setSelectedTool("circle")}
          activated={selectedTool === "circle"}
          shortcut="4"
        />
        <IconButton
          icon={<ArrowRight />}
          onClick={() => setSelectedTool("arrow")}
          activated={selectedTool === "arrow"}
          shortcut="5"
        />
        <IconButton
          icon={<Minus />}
          onClick={() => setSelectedTool("line")}
          activated={selectedTool === "line"}
          shortcut="6"
        />
        <div className="w-[1px] bg-white/10 mx-1 self-stretch" />
        <IconButton
          icon={<Pencil />}
          onClick={() => setSelectedTool("pencil")}
          activated={selectedTool === "pencil"}
          shortcut="7"
        />
        <IconButton
          icon={<Type />}
          onClick={() => setSelectedTool("text")}
          activated={selectedTool === "text"}
          shortcut="8"
        />
        <div className="w-[1px] bg-white/10 mx-1 self-stretch" />
        <IconButton
          icon={<Eraser />}
          onClick={() => setSelectedTool("eraser")}
          activated={selectedTool === "eraser"}
          shortcut="9"
        />
      </div>
    </div>
  );
}
