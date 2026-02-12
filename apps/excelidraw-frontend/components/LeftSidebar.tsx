"use client";

import { useState, RefObject } from "react";
import { Menu, X, FileDown, Image } from "lucide-react";
import { exportCanvasAsPDF, exportCanvasAsPNG } from "@/draw/exportCanvas";

const BG_COLORS = [
  { color: "#000000", label: "Black" },
  { color: "#ffffff", label: "White" },
  { color: "#121212", label: "Dark Gray" },
  { color: "#0d1b2a", label: "Navy" },
  { color: "#0a1f0a", label: "Dark Green" },
];

const STROKE_COLORS = [
  { color: "#ffffff", label: "White" },
  { color: "#000000", label: "Black" },
  { color: "#ef4444", label: "Red" },
  { color: "#eab308", label: "Yellow" },
  { color: "#22c55e", label: "Green" },
  { color: "#06b6d4", label: "Cyan" },
  { color: "#a855f7", label: "Violet" },
];

const THICKNESS_OPTIONS = [
  { value: 1, label: "Thin" },
  { value: 3, label: "Medium" },
  { value: 5, label: "Thick" },
];

export function LeftSidebar({
  bgColor,
  setBgColor,
  strokeColor,
  setStrokeColor,
  lineWidth,
  setLineWidth,
  canvasRef,
}: {
  bgColor: string;
  setBgColor: (c: string) => void;
  strokeColor: string;
  setStrokeColor: (c: string) => void;
  lineWidth: number;
  setLineWidth: (w: number) => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    if (!canvasRef.current) return;
    setExporting(true);
    // Small delay to let UI update
    setTimeout(() => {
      exportCanvasAsPDF(canvasRef.current!);
      setExporting(false);
    }, 100);
  };

  const handleExportPNG = () => {
    if (!canvasRef.current) return;
    exportCanvasAsPNG(canvasRef.current);
  };

  return (
    <>
      {/* Hamburger toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-[60] w-10 h-10 rounded-xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center hover:bg-zinc-800 hover:border-white/20 transition-all duration-300"
        title={isOpen ? "Close panel" : "Open properties"}
      >
        {isOpen ? (
          <X size={18} className="text-white" />
        ) : (
          <Menu size={18} className="text-white" />
        )}
      </button>

      {/* Sidebar panel with slide animation */}
      <div
        className={`fixed left-4 top-16 z-50 flex flex-col gap-5 p-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-[200px] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-8 pointer-events-none"
        }`}
      >
        {/* ── Background Color ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Background
          </span>
          <div className="flex flex-wrap gap-2">
            {BG_COLORS.map((bg) => (
              <button
                key={bg.color}
                onClick={() => setBgColor(bg.color)}
                className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                  bgColor === bg.color
                    ? "border-violet-400 shadow-md shadow-violet-500/30 scale-110"
                    : "border-white/10 hover:border-white/30"
                }`}
                style={{ backgroundColor: bg.color }}
                title={bg.label}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10" />

        {/* ── Stroke Color ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Stroke Color
          </span>
          <div className="flex flex-wrap gap-2">
            {STROKE_COLORS.map((sc) => (
              <button
                key={sc.color}
                onClick={() => setStrokeColor(sc.color)}
                className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                  strokeColor === sc.color
                    ? "border-violet-400 shadow-md shadow-violet-500/30 scale-110"
                    : "border-white/10 hover:border-white/30"
                }`}
                style={{ backgroundColor: sc.color }}
                title={sc.label}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10" />

        {/* ── Stroke Thickness ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Thickness
          </span>
          <div className="flex gap-2">
            {THICKNESS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLineWidth(opt.value)}
                className={`flex-1 h-9 rounded-lg border-2 transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                  lineWidth === opt.value
                    ? "border-violet-400 shadow-md shadow-violet-500/30 bg-white/10"
                    : "border-white/10 hover:border-white/30 bg-zinc-800"
                }`}
                title={opt.label}
              >
                <div
                  className="w-5 rounded-full bg-white"
                  style={{ height: `${opt.value}px` }}
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 px-1">
            <span>Thin</span>
            <span>Medium</span>
            <span>Thick</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10" />

        {/* ── Export ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Export
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs font-medium hover:bg-violet-600 hover:border-violet-500 transition-all duration-200 disabled:opacity-50"
            >
              <FileDown size={14} />
              {exporting ? "Exporting…" : "Export as PDF"}
            </button>
            <button
              onClick={handleExportPNG}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs font-medium hover:bg-blue-600 hover:border-blue-500 transition-all duration-200"
            >
              <Image size={14} />
              Export as PNG
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
