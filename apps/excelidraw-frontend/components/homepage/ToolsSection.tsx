import { Pencil } from "lucide-react";
import { ToolShowcase } from "./ToolShowcase";

export function ToolsSection() {
  return (
    <section id="tools" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Pencil className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">
              Powerful Tools
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              express ideas
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Intuitive tools that feel natural. Just like sketching on paper.
          </p>
        </div>

        <ToolShowcase />
      </div>
    </section>
  );
}
