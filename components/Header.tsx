"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, ArrowUpRight, ShieldCheck, Terminal } from "lucide-react";
import { audio } from "@/lib/audio";

export function Header() {
  const [soundOn, setSoundOn] = useState(true);
  const [colomboTime, setColomboTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setColomboTime(`${timeStr} LK`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = audio.toggle();
    setSoundOn(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#232936] bg-[#08090c]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identity & Origin */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={() => audio.click()}
            className="flex items-center gap-2.5 font-semibold text-[#f3f4f6] tracking-tight group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#06b6d4]/40 bg-[#06b6d4]/10 text-[#06b6d4] font-mono text-xs font-bold transition-all group-hover:bg-[#06b6d4] group-hover:text-[#08090c] group-hover:shadow-[0_0_12px_rgba(6,182,212,0.6)]">
              SH
            </div>
            <div>
              <span className="block text-sm font-bold leading-none tracking-tight">Supun Hewagamage</span>
              <span className="block text-[11px] font-mono text-[#06b6d4] leading-tight">
                Ethical Hacker & Systems Architect
              </span>
            </div>
          </a>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-[#232936] bg-[#0e1117] px-2.5 py-0.5 text-[11px] font-mono text-[#10b981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>ALL SYSTEMS NOMINAL</span>
          </div>
        </div>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#9ca3af]">
          <a
            href="#infrastructure"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#06b6d4]"
          >
            // CAMPUS INFRA
          </a>
          <a
            href="#forensics"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#06b6d4]"
          >
            // GO & RUST TOOLING
          </a>
          <a
            href="#creative"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#06b6d4]"
          >
            // 3D LAB
          </a>
          <a
            href="#specs"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#06b6d4]"
          >
            // SPECS
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Colombo Clock */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-sm border border-[#232936] bg-[#0e1117] px-2.5 py-1 font-mono text-[11px] text-[#9ca3af]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4]" />
            <span>{colomboTime || "00:00:00 LK"}</span>
          </div>

          {/* Audio FX Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle haptic audio"
            title={soundOn ? "Haptic audio active" : "Audio muted"}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#232936] bg-[#0e1117] text-[#9ca3af] transition-colors hover:border-[#06b6d4] hover:text-[#06b6d4] active:scale-95"
          >
            {soundOn ? <Volume2 size={14} className="text-[#06b6d4]" /> : <VolumeX size={14} />}
          </button>

          {/* Contact Jump */}
          <a
            href="#contact"
            onClick={() => audio.click()}
            className="btn-cyber-primary inline-flex items-center gap-1 rounded-sm px-3.5 py-1.5 text-xs font-mono transition-all active:scale-95"
          >
            <span>TRANSMIT</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}
