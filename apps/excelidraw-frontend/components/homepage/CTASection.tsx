import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export function CTASection() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 relative overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to start creating?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of teams using Zendraw to bring their ideas to
              life.
            </p>
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                className="h-14 px-10 rounded-full !bg-white !text-black hover:!bg-zinc-200 border-none font-medium transition-all hover:scale-105"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
