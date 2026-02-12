"use client";

import { useEffect, useState } from "react";
import { Square, Pencil, Type, Minus, ArrowRight } from "lucide-react";

const demos = [
  {
    title: "Draw Shapes",
    desc: "Rectangles, circles, and more",
    icon: Square,
    color: "#8b5cf6",
    visual: (
      <div className="flex gap-4 items-center justify-center h-full">
        <div className="w-16 h-12 border-2 border-violet-400 rounded-lg bg-violet-400/10 animate-pulse" />
        <div
          className="w-12 h-12 border-2 border-blue-400 rounded-full bg-blue-400/10 animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-14 h-10 border-2 border-pink-400 rounded-lg bg-pink-400/10 animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    ),
  },
  {
    title: "Freehand Draw",
    desc: "Sketch ideas naturally",
    icon: Pencil,
    color: "#f59e0b",
    visual: (
      <svg className="w-full h-full" viewBox="0 0 200 100">
        <path
          d="M20,50 Q50,20 80,50 T140,50 T200,50"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw"
        />
      </svg>
    ),
  },
  {
    title: "Add Text",
    desc: "Labels and annotations",
    icon: Type,
    color: "#06b6d4",
    visual: (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <span className="text-2xl font-bold text-cyan-400 animate-pulse">
          Hello!
        </span>
        <span className="text-sm text-cyan-400/60">Click to type...</span>
      </div>
    ),
  },
  {
    title: "Connect Ideas",
    desc: "Lines and arrows",
    icon: Minus,
    color: "#10b981",
    visual: (
      <svg className="w-full h-full" viewBox="0 0 200 100">
        <line
          x1="30"
          y1="50"
          x2="170"
          y2="50"
          stroke="#10b981"
          strokeWidth="2"
          className="animate-draw-line"
        />
        <polygon points="170,50 160,44 160,56" fill="#10b981" />
      </svg>
    ),
  },
];

export function ToolShowcase() {
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Tool buttons */}
      <div className="space-y-3">
        {demos.map((demo, idx) => (
          <button
            key={demo.title}
            onClick={() => setActiveDemo(idx)}
            className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 ${
              activeDemo === idx
                ? "bg-zinc-800/80 border border-white/10 shadow-lg"
                : "hover:bg-zinc-900/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeDemo === idx ? "scale-110" : ""
              }`}
              style={{
                backgroundColor: demo.color + "20",
                color: demo.color,
              }}
            >
              <demo.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">{demo.title}</h4>
              <p className="text-sm text-zinc-500">{demo.desc}</p>
            </div>
            {activeDemo === idx && (
              <ArrowRight
                className="ml-auto w-5 h-5"
                style={{ color: demo.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Visual demo */}
      <div className="relative h-64 rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="relative z-10 h-full p-8">
          {demos[activeDemo]?.visual}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
          style={{ backgroundColor: demos[activeDemo]?.color }}
        />
      </div>
    </div>
  );
}
