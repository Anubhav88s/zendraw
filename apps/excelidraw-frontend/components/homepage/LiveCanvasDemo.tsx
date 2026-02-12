"use client";

import { useEffect, useState, useRef } from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  Pencil,
  Type,
} from "lucide-react";

const tools = [
  { icon: MousePointer2, name: "Select", color: "#8b5cf6" },
  { icon: Square, name: "Rectangle", color: "#3b82f6" },
  { icon: Circle, name: "Circle", color: "#ec4899" },
  { icon: Minus, name: "Line", color: "#10b981" },
  { icon: Pencil, name: "Pencil", color: "#f59e0b" },
  { icon: Type, name: "Text", color: "#06b6d4" },
];

export function LiveCanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTool((prev) => (prev + 1) % tools.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.offsetWidth; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.offsetHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.offsetHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.offsetWidth, y);
      ctx.stroke();
    }

    // Hand-drawn style helper
    const drawSketchyLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 4;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 4;
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();
    };

    // Draw sketchy rectangle
    const drawSketchyRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      color: string,
    ) => {
      ctx.fillStyle = color + "15";
      ctx.fillRect(x, y, w, h);
      drawSketchyLine(x, y, x + w, y, color);
      drawSketchyLine(x + w, y, x + w, y + h, color);
      drawSketchyLine(x + w, y + h, x, y + h, color);
      drawSketchyLine(x, y + h, x, y, color);
    };

    // Draw sketchy circle
    const drawSketchyCircle = (
      cx: number,
      cy: number,
      r: number,
      color: string,
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillStyle = color + "15";
      ctx.beginPath();
      for (let i = 0; i <= 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const wobble = Math.random() * 2 - 1;
        const px = cx + (r + wobble) * Math.cos(angle);
        const py = cy + (r + wobble) * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Draw sample shapes
    drawSketchyRect(60, 80, 140, 90, "#8b5cf6");
    drawSketchyCircle(350, 120, 50, "#3b82f6");
    drawSketchyRect(280, 200, 100, 70, "#ec4899");

    // Draw arrow
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 125);
    ctx.lineTo(290, 125);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(290, 125);
    ctx.lineTo(280, 118);
    ctx.moveTo(290, 125);
    ctx.lineTo(280, 132);
    ctx.stroke();

    // Draw pencil stroke
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(80, 220);
    const points = [
      [95, 235],
      [120, 210],
      [140, 240],
      [165, 215],
      [180, 245],
    ];
    points.forEach(([px, py]) => ctx.lineTo(px!, py!));
    ctx.stroke();

    // Draw text
    ctx.font = '16px "Comic Sans MS", cursive';
    ctx.fillStyle = "#06b6d4";
    ctx.fillText("Ideas ✨", 320, 260);
  }, [activeTool]);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-violet-500/10">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 border-b border-white/5 bg-zinc-950/50">
        {tools.map((tool, idx) => (
          <div
            key={tool.name}
            className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
              activeTool === idx
                ? "bg-violet-500/20 ring-2 ring-violet-500/50 scale-110"
                : "hover:bg-white/5"
            }`}
            style={{
              color: activeTool === idx ? tool.color : "#71717a",
            }}
          >
            <tool.icon className="w-4 h-4" />
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">3 online</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative aspect-[16/10] bg-zinc-950">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Animated cursors */}
        <div
          className="absolute transition-all duration-1000 ease-in-out"
          style={{
            left: `${30 + (activeTool % 3) * 20}%`,
            top: `${25 + Math.floor(activeTool / 3) * 30}%`,
          }}
        >
          <div className="flex items-center gap-1">
            <MousePointer2 className="w-4 h-4 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <span className="px-2 py-0.5 rounded-md bg-violet-500 text-[10px] font-medium shadow-lg">
              You
            </span>
          </div>
        </div>

        <div
          className="absolute transition-all duration-[2000ms] ease-in-out"
          style={{
            left: `${60 - (activeTool % 2) * 15}%`,
            top: `${40 + (activeTool % 3) * 10}%`,
          }}
        >
          <div className="flex items-center gap-1">
            <MousePointer2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[10px] font-medium shadow-lg">
              Alex
            </span>
          </div>
        </div>

        <div
          className="absolute transition-all duration-[1500ms] ease-in-out"
          style={{
            left: `${45 + (activeTool % 4) * 8}%`,
            top: `${55 - (activeTool % 2) * 20}%`,
          }}
        >
          <div className="flex items-center gap-1">
            <MousePointer2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-[10px] font-medium shadow-lg">
              Sam
            </span>
          </div>
        </div>

        {/* Drawing indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: tools[activeTool]?.color }}
          />
          <span className="text-xs text-zinc-400">
            Drawing with{" "}
            <span className="text-white font-medium">
              {tools[activeTool]?.name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
