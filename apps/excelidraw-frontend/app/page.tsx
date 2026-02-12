"use client";

import {
  Header,
  Footer,
  HeroSection,
  FeaturesSection,
  ToolsSection,
  CTASection,
  FloatingShapes,
} from "@/components/homepage";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LandingPage() {
  const isChecking = useAuthRedirect();

  if (isChecking) {
    return <div className="w-screen h-screen bg-black" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes draw {
          from {
            stroke-dashoffset: 300;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw {
          stroke-dasharray: 300;
          animation: draw 2s ease-in-out infinite;
        }
        @keyframes draw-line {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-line {
          stroke-dasharray: 200;
          animation: draw-line 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,50,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(50,120,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
      </div>

      <FloatingShapes />
      <Header />
      <HeroSection />
      <ToolsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
