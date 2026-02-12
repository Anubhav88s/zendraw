import { Pencil, Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-16 px-6 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-500 to-blue-600 p-2 rounded-xl">
              <Pencil className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Zendraw</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link
              href="https://github.com/Anubhav88s/Almost-Room-Chat"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-zinc-600">
          © 2024 Zendraw. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
