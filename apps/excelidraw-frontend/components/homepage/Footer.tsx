import { Github, Linkedin, Heart, Mail, Sparkles, Zap, Users2, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  { icon: Zap, label: "Real-time Sync", color: "text-amber-400" },
  { icon: Users2, label: "Multiplayer", color: "text-blue-400" },
  { icon: Shield, label: "Secure Rooms", color: "text-emerald-400" },
  { icon: Sparkles, label: "Free Forever", color: "text-violet-400" },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-black overflow-hidden">
      {/* Top accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-gradient-to-b from-violet-500/[0.08] to-transparent blur-3xl" />

      {/* Highlights bar */}
      <div className="border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:border-white/10 transition-all duration-300">
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <span className="text-sm text-zinc-400 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Zendraw Logo"
                width={44}
                height={44}
                className="rounded-xl"
              />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Zendraw
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mb-6">
              A collaborative whiteboarding platform that lets teams draw,
              brainstorm, and visualize ideas together in real-time. Completely
              free, no sign-up walls — just create a room and start drawing.
            </p>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#tools"
                  className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                >
                  Drawing Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-4 md:col-start-9 md:pl-8 md:-mt-6">
            {/* Card container */}
            <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
              {/* Corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />

              {/* Heading with decorative line */}
              <div className="relative mb-6">
                <h4 className="text-sm font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase tracking-[0.2em]">
                  Get in Touch
                </h4>
                <div className="mt-2 w-10 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
              </div>

              {/* Email */}
              <Link
                href="mailto:anubhavrajsinghu@gmail.com"
                className="group flex items-center gap-3 mb-6"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10 group-hover:border-emerald-500/30 group-hover:shadow-lg group-hover:shadow-emerald-500/5 transition-all duration-300">
                  <Mail className="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-[13px] text-zinc-400 group-hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4 group-hover:decoration-emerald-500/50">
                  anubhavrajsinghu@gmail.com
                </span>
              </Link>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] mb-5" />

              {/* Social icons */}
              <div className="flex items-center gap-2.5">
                <Link
                  href="https://github.com/Anubhav88s"
                  target="_blank"
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-zinc-500/40 hover:bg-white/[0.06] transition-all duration-300"
                  title="GitHub"
                >
                  <Github className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-xs text-zinc-500 group-hover:text-white font-medium transition-colors">GitHub</span>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/anubhav-raj-singh-88a03b2b5/"
                  target="_blank"
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/40 hover:bg-blue-500/[0.06] transition-all duration-300"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  <span className="text-xs text-zinc-500 group-hover:text-blue-400 font-medium transition-colors">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Zendraw. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-600">
            Made with{" "}
            <Heart className="w-3 h-3 text-red-500/70 fill-red-500/70 animate-pulse" />{" "}
            by Anubhav Raj Singh
          </p>
        </div>
      </div>
    </footer>
  );
}
