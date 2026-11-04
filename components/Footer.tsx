"use client";

import { ArrowUp, Shield } from "lucide-react";
import { audio } from "@/lib/audio";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    audio.click();
  };

  return (
    <footer className="border-t border-[#232936] bg-[#08090c] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#f3f4f6] tracking-wider uppercase">
                SUPUN HEWAGAMAGE
              </span>
              <span className="font-mono text-xs text-[#232936]">/</span>
              <span className="font-mono text-xs text-[#06b6d4]">
                COLOMBO, SRI LANKA
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-[#9ca3af]">
              Next.js 16 · Tailwind 4 · Three.js · Blender 5.2 Sentinel Mesh (35.8 KB) · Web Audio Haptics
            </p>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-[#9ca3af]">
              © {new Date().getFullYear()} Supun Hewagamage. All systems fortified.
            </span>

            <button
              onClick={scrollToTop}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#232936] bg-[#0e1117] text-[#9ca3af] transition-colors hover:border-[#06b6d4] hover:text-[#06b6d4]"
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
