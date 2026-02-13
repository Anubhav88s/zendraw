import { ArrowRight, Sparkles, Users2, Layers, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { LiveCanvasDemo } from "./LiveCanvasDemo";

export function HeroSection() {
  return (
    <section className="relative z-10 pt-40 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">
                Now with real-time collaboration
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[0.95]">
              Draw.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Collaborate.
              </span>
              <br />
              Create.
            </h1>

            <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-md">
              The infinite canvas for teams. Sketch diagrams, brainstorm ideas,
              and bring your vision to life together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-14 px-8 rounded-full !bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-none shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] hover:scale-105"
                >
                  Start Drawing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

            </div>

          </div>

          {/* Right side - Live Canvas Demo */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
            <LiveCanvasDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
