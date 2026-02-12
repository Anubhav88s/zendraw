"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function Signup() {
  const router = useRouter();
  const isChecking = useAuthRedirect();
  const {
    name,
    email,
    password,
    error,
    loading,
    setName,
    setEmail,
    setPassword,
    signup,
  } = useAuthStore();

  const handleSignup = async () => {
    const success = await signup();
    if (success) {
      router.push("/signin");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSignup();
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

        {/* Form */}
        <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create an account
            </h1>
            <p className="text-zinc-500 text-sm">
              Start drawing and collaborating today
            </p>
          </div>

          <div className="space-y-4" onKeyDown={handleKeyDown}>
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="auth-input w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.08] focus:outline-none focus:border-violet-500/50 transition-all duration-300 placeholder:text-zinc-600 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
              <p className="text-[10px] text-zinc-600 mt-2 ml-1 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" />
                Must be at least 6 characters
              </p>
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
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </Button>
            </div>

            {/* Link */}
            <div className="text-center pt-4">
              <p className="text-zinc-500 text-sm">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Animated Design Panel ===== */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-black to-violet-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.1),transparent_50%)]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Floating orbs */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] animate-float-orb" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-violet-600/15 rounded-full blur-[120px] animate-float-orb-delayed" />
        <div className="absolute top-1/2 right-1/2 w-56 h-56 bg-cyan-500/8 rounded-full blur-[80px] animate-float-orb-slow" />

        {/* Decorative SVG — collaboration scene */}
        <div className="relative z-10 w-full max-w-lg px-12">
          <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Canvas board */}
            <rect x="40" y="40" width="320" height="320" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Grid lines */}
            <line x1="40" y1="120" x2="360" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="40" y1="280" x2="360" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="120" y1="40" x2="120" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="280" y1="40" x2="280" y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

            {/* Animated star shape */}
            <path d="M200 70 L215 130 L280 130 L225 165 L245 230 L200 190 L155 230 L175 165 L120 130 L185 130 Z" stroke="rgba(59,130,246,0.6)" strokeWidth="2" fill="rgba(59,130,246,0.04)" strokeDasharray="600" strokeDashoffset="600">
              <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2.5s" begin="0.3s" fill="freeze" />
            </path>

            {/* Animated rounded rect */}
            <rect x="70" y="250" width="130" height="80" rx="12" stroke="rgba(236,72,153,0.5)" strokeWidth="2" fill="rgba(236,72,153,0.04)" strokeDasharray="420" strokeDashoffset="420">
              <animate attributeName="stroke-dashoffset" from="420" to="0" dur="2s" begin="1s" fill="freeze" />
            </rect>

            {/* Animated wavy line */}
            <path d="M230 270 Q260 240 280 270 Q300 300 330 270 Q350 245 340 300" stroke="rgba(34,211,238,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200">
              <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.5s" begin="1.5s" fill="freeze" />
            </path>

            {/* Small dots/annotations */}
            <circle cx="135" cy="290" r="3" fill="rgba(236,72,153,0.4)" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="3s" fill="freeze" />
            </circle>
            <circle cx="200" cy="130" r="3" fill="rgba(59,130,246,0.4)" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="3.2s" fill="freeze" />
            </circle>

            {/* Text lines inside rect */}
            <rect x="85" y="275" width="55" height="4" rx="2" fill="rgba(236,72,153,0.25)" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="3s" fill="freeze" />
            </rect>
            <rect x="85" y="285" width="40" height="4" rx="2" fill="rgba(236,72,153,0.15)" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="3.2s" fill="freeze" />
            </rect>

            {/* Cursor 1 */}
            <g opacity="0" transform="translate(195, 185)">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.8s" fill="freeze" />
              <animateTransform attributeName="transform" type="translate" from="195 185" to="180 170" dur="2s" begin="2.8s" fill="freeze" />
              <path d="M0 0 L0 16 L5 12 L9 20 L12 18 L8 10 L14 10 Z" fill="rgba(59,130,246,0.9)" />
            </g>

            {/* Cursor 2 */}
            <g opacity="0" transform="translate(130, 280)">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="3.3s" fill="freeze" />
              <animateTransform attributeName="transform" type="translate" from="130 280" to="145 295" dur="2.5s" begin="3.3s" fill="freeze" />
              <path d="M0 0 L0 16 L5 12 L9 20 L12 18 L8 10 L14 10 Z" fill="rgba(236,72,153,0.9)" />
            </g>

            {/* Cursor 3 */}
            <g opacity="0" transform="translate(310, 265)">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="3.8s" fill="freeze" />
              <animateTransform attributeName="transform" type="translate" from="310 265" to="320 280" dur="2s" begin="3.8s" fill="freeze" />
              <path d="M0 0 L0 16 L5 12 L9 20 L12 18 L8 10 L14 10 Z" fill="rgba(34,211,238,0.9)" />
            </g>
          </svg>

          {/* Text below illustration */}
          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent mb-2">
              Better together
            </h2>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Invite your team and bring ideas to life on a shared canvas.
            </p>
          </div>
        </div>

        {/* Border glow between panels */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>
    </div>
  );
}
