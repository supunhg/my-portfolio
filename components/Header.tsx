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
      setColomboTime(`${timeStr} LK (UTC+5:30)`);
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
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e1d8] bg-[#f8f7f4]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identity & Origin */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={() => audio.click()}
            className="flex items-center gap-2.5 font-semibold text-[#141619] tracking-tight group"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#141619] text-[#f8f7f4] font-mono text-xs font-bold transition-transform group-hover:scale-105">
              SH
            </div>
            <div>
              <span className="block text-sm font-bold leading-none">Supun Hewagamage</span>
              <span className="block text-[11px] font-mono text-[#646872] leading-tight">
                Systems & Security Architect
              </span>
            </div>
          </a>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-[#e5e1d8] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#141619] shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>Open for Core Engagements</span>
          </div>
        </div>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#646872]">
          <a
            href="#infrastructure"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#141619]"
          >
            Campus Infra
          </a>
          <a
            href="#forensics"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#141619]"
          >
            Forensics & Rust
          </a>
          <a
            href="#creative"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#141619]"
          >
            Tactile 3D
          </a>
          <a
            href="#specs"
            onClick={() => audio.click()}
            className="transition-colors hover:text-[#141619]"
          >
            Spec Sheet
          </a>
        </nav>

        {/* Right Actions: Colombo Clock, Sound FX, Contact CTA */}
        <div className="flex items-center gap-3">
          {/* Colombo Clock */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-sm border border-[#e5e1d8] bg-white/70 px-2.5 py-1 font-mono text-[11px] text-[#646872]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
            <span>{colomboTime || "00:00:00 LK"}</span>
          </div>

          {/* Audio FX Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle haptic audio"
            title={soundOn ? "Haptic audio active" : "Audio muted"}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#e5e1d8] bg-white text-[#141619] transition-colors hover:border-[#141619] active:scale-95"
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} className="text-[#989da8]" />}
          </button>

          {/* Contact Jump */}
          <a
            href="#contact"
            onClick={() => audio.click()}
            className="inline-flex items-center gap-1 rounded-sm bg-[#141619] px-3.5 py-1.5 text-xs font-semibold text-[#f8f7f4] transition-all hover:bg-[#ff5a1f] active:scale-95"
          >
            <span>Dossier</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}
