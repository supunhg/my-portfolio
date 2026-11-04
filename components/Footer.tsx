"use client";

import { ArrowUp } from "lucide-react";
import { audio } from "@/lib/audio";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    audio.click();
  };

  return (
    <footer className="border-t border-[#e5e1d8] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#141619] tracking-wider uppercase">
                SUPUN HEWAGAMAGE
              </span>
              <span className="font-mono text-xs text-[#989da8]">/</span>
              <span className="font-mono text-xs text-[#646872]">
                COLOMBO, SRI LANKA
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-[#646872]">
              Next.js 16 · Tailwind 4 · Three.js · Blender 5.2 (Meshopt 59.4 KB) · Web Audio API
            </p>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-[#646872]">
              © {new Date().getFullYear()} Supun Hewagamage. All systems nominal.
            </span>

            <button
              onClick={scrollToTop}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#e5e1d8] bg-[#f8f7f4] text-[#141619] transition-colors hover:border-[#141619]"
              title="Return to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
