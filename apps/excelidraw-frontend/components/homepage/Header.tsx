import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50">
      <div className="mx-4 mt-4">
        <div className="max-w-6xl mx-auto px-6 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 blur-lg opacity-50" />
                <Image src="/logo.png" alt="Zendraw Logo" width={56} height={56} className="relative rounded-xl" />
              </div>
              <span className="text-xl font-bold tracking-tight">Zendraw</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#tools"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Tools
              </Link>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Docs
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="sm"
                  className="!bg-white !text-black hover:!bg-zinc-200 border-none rounded-full px-5 font-medium"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
