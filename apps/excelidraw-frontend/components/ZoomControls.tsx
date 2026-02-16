"use client";

import { Minus, Plus } from "lucide-react";
import { Game } from "@/draw/Game";

export function ZoomControls({ game, scale }: { game?: Game; scale: number }) {
  const handleZoomIn = () => game?.zoomIn();
  const handleZoomOut = () => game?.zoomOut();
  const handleReset = () => game?.resetZoom();

  const percentage = Math.round(scale * 100);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-0 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl">
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-l-lg transition-all duration-200"
          title="Zoom out (Ctrl -)"
        >
          <Minus size={16} />
        </button>

        <button
          onClick={handleReset}
          className="h-10 px-3 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium min-w-[60px] border-x border-white/10"
          title="Reset zoom (Ctrl 0)"
        >
          {percentage}%
        </button>

        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-r-lg transition-all duration-200"
          title="Zoom in (Ctrl +)"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
