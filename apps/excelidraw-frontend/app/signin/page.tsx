"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function Signin() {
  const router = useRouter();
  const isChecking = useAuthRedirect();
  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    signin,
  } = useAuthStore();

  const handleSignin = async () => {
    const success = await signin();
    if (success) {
      router.push("/dashboard");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSignin();
    }
  };

  if (isChecking) {
    return <div className="w-screen h-screen bg-black" />;
  }

  return (
    <div className="w-screen h-screen flex bg-black overflow-hidden">
      {/* ===== LEFT SIDE — Form ===== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 relative z-10 shrink-0">
        {/* Subtle background for left panel */}
        <div className="absolute inset-0 bg-zinc-950/80" />

        {/* Logo — top left */}
        <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
          <div className="bg-gradient-to-br from-violet-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-violet-500/20">
            <Pencil className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
            Zendraw
          </span>
        </div>

        {/* Form card */}
        <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-zinc-500 text-sm">
              Sign in to continue to your workspace
            </p>
          </div>

          <div className="space-y-5" onKeyDown={handleKeyDown}>
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block uppercase tracking-wider">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="name@example.com"
                  className="auth-input w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.08] focus:outline-none focus:border-violet-500/50 transition-all duration-300 placeholder:text-zinc-600 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="auth-input w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.08] focus:outline-none focus:border-violet-500/50 transition-all duration-300 placeholder:text-zinc-600 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                {error}
              </div>
            )}

            {/* Button */}
            <div className="pt-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full group"
                onClick={handleSignin}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </Button>
            </div>

            {/* Link */}
            <div className="text-center pt-4">
              <p className="text-zinc-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Animated Design Panel ===== */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-black to-blue-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.1),transparent_50%)]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] animate-float-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-float-orb-delayed" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-float-orb-slow" />

        {/* Decorative SVG Canvas Illustration */}
        <div className="relative z-10 w-full max-w-lg px-12">
          <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Canvas board */}
            <rect x="40" y="40" width="320" height="320" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Grid lines on canvas */}
            <line x1="40" y1="120" x2="360" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="40" y1="280" x2="360" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="120" y1="40" x2="120" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="280" y1="40" x2="280" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

            {/* Animated drawn rectangle */}
            <rect x="80" y="80" width="120" height="90" rx="8" stroke="rgba(139,92,246,0.6)" strokeWidth="2" fill="rgba(139,92,246,0.05)" className="animate-draw-shape" strokeDasharray="420" strokeDashoffset="420">
              <animate attributeName="stroke-dashoffset" from="420" to="0" dur="2s" begin="0.3s" fill="freeze" />
            </rect>

            {/* Animated drawn circle */}
            <circle cx="290" cy="130" r="50" stroke="rgba(59,130,246,0.6)" strokeWidth="2" fill="rgba(59,130,246,0.05)" strokeDasharray="315" strokeDashoffset="315">
              <animate attributeName="stroke-dashoffset" from="315" to="0" dur="2s" begin="0.8s" fill="freeze" />
            </circle>

            {/* Animated drawn triangle / arrow path */}
            <path d="M100 250 L180 200 L180 300 Z" stroke="rgba(236,72,153,0.5)" strokeWidth="2" fill="rgba(236,72,153,0.04)" strokeDasharray="300" strokeDashoffset="300">
              <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" begin="1.3s" fill="freeze" />
            </path>

            {/* Connecting line between shapes */}
            <line x1="200" y1="125" x2="240" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="60" strokeDashoffset="60">
              <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1s" begin="2.5s" fill="freeze" />
            </line>

            {/* Animated freehand-style curve */}
            <path d="M240 260 C260 220, 320 240, 310 290 C300 340, 250 310, 240 260" stroke="rgba(34,211,238,0.5)" strokeWidth="2" fill="rgba(34,211,238,0.03)" strokeDasharray="250" strokeDashoffset="250">
              <animate attributeName="stroke-dashoffset" from="250" to="0" dur="2s" begin="1.8s" fill="freeze" />
            </path>

            {/* Text placeholder lines */}
            <rect x="85" y="105" width="60" height="4" rx="2" fill="rgba(139,92,246,0.3)" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="2.5s" fill="freeze" />
            </rect>
            <rect x="85" y="115" width="45" height="4" rx="2" fill="rgba(139,92,246,0.2)" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="2.7s" fill="freeze" />
            </rect>

            {/* Cursor icon */}
            <g opacity="0" transform="translate(175, 190)">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="3s" fill="freeze" />
              <animateTransform attributeName="transform" type="translate" from="175 190" to="160 180" dur="2s" begin="3s" fill="freeze" />
              <path d="M0 0 L0 16 L5 12 L9 20 L12 18 L8 10 L14 10 Z" fill="rgba(139,92,246,0.9)" />
            </g>

            {/* Second cursor (collaborator) */}
            <g opacity="0" transform="translate(280, 260)">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="3.5s" fill="freeze" />
              <animateTransform attributeName="transform" type="translate" from="280 260" to="295 275" dur="2.5s" begin="3.5s" fill="freeze" />
              <path d="M0 0 L0 16 L5 12 L9 20 L12 18 L8 10 L14 10 Z" fill="rgba(59,130,246,0.9)" />
            </g>
          </svg>

          {/* Text below illustration */}
          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent mb-2">
              Draw. Collaborate. Create.
            </h2>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Real-time whiteboarding with your team, beautifully simple.
            </p>
          </div>
        </div>

        {/* Border glow between panels */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
      </div>
    </div>
  );
}