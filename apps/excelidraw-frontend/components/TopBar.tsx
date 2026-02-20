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
  Hand,
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
    <div className="fixed bottom-3 left-2 right-2 md:bottom-auto md:top-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50">
      <div className="flex gap-0.5 md:gap-1 p-1 md:p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-300 justify-center">
        <IconButton
          icon={<Hand size={20} />}
          onClick={() => setSelectedTool("pan")}
          activated={selectedTool === "pan"}
          shortcut="0"
        />
        <IconButton
          icon={<MousePointer2 size={20} />}
          onClick={() => setSelectedTool("selection")}
          activated={selectedTool === "selection"}
          shortcut="1"
        />
        <div className="hidden md:block w-[1px] bg-white/10 mx-1 self-stretch" />
        <IconButton
          icon={<Pencil size={20} />}
          onClick={() => setSelectedTool("pencil")}
          activated={selectedTool === "pencil"}
          shortcut="7"
        />
        <IconButton
          icon={<Eraser size={20} />}
          onClick={() => setSelectedTool("eraser")}
          activated={selectedTool === "eraser"}
          shortcut="9"
        />
        <IconButton
          icon={<RectangleHorizontalIcon size={20} />}
          onClick={() => setSelectedTool("rect")}
          activated={selectedTool === "rect"}
          shortcut="2"
        />
        <IconButton
          icon={<Diamond size={20} />}
          onClick={() => setSelectedTool("diamond")}
          activated={selectedTool === "diamond"}
          shortcut="3"
        />
        <IconButton
          icon={<Circle size={20} />}
          onClick={() => setSelectedTool("circle")}
          activated={selectedTool === "circle"}
          shortcut="4"
        />
        <div className="hidden md:block w-[1px] bg-white/10 mx-1 self-stretch" />
        <IconButton
          icon={<ArrowRight size={20} />}
          onClick={() => setSelectedTool("arrow")}
          activated={selectedTool === "arrow"}
          shortcut="5"
        />
        <IconButton
          icon={<Minus size={20} />}
          onClick={() => setSelectedTool("line")}
          activated={selectedTool === "line"}
          shortcut="6"
        />
        <IconButton
          icon={<Type size={20} />}
          onClick={() => setSelectedTool("text")}
          activated={selectedTool === "text"}
          shortcut="8"
        />
      </div>
    </div>
  );
}
