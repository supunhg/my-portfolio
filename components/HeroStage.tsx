"use client";

import { Shield, Cpu, Binary, Terminal, Lock, ChevronRight, Activity, Sparkles } from "lucide-react";
import { AvatarCompanion } from "./AvatarCompanion";
import { audio } from "@/lib/audio";

interface HeroStageProps {
  activeSection: string;
}

export function HeroStage({ activeSection }: HeroStageProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#232936] bg-gradient-to-b from-[#08090c] via-[#0d1017] to-[#08090c] pt-12 pb-20">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-35 pointer-events-none" />

      {/* Cyber Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#06b6d4]/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Mission & Identity */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-3 py-1 font-mono text-[11px] font-bold text-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Shield size={12} className="animate-pulse" />
              <span>OFFENSIVE SECURITY & SYSTEMS ARCHITECT // NIBM COLOMBO</span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-[#f3f4f6] leading-[1.08]">
              I attack systems to understand them. <br />
              <span className="text-[#06b6d4] glow-cyan">I build them to endure.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#9ca3af] leading-relaxed max-w-2xl">
              Undergraduate in Ethical Hacking & Network Security (Diploma GPA 3.83/4.0).
              Architect of NIBM’s campus student infrastructure (34 containers behind Authentik),
              developer of Go/Rust forensic tooling, and creator of tactile 3D interactive experiences.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#infrastructure"
                onClick={() => audio.click()}
                className="btn-cyber-primary inline-flex items-center gap-2 rounded-sm px-5 py-3 text-xs font-mono tracking-wider transition-all"
              >
                <Cpu size={14} />
                <span>EXPLORE CAMPUS ESXi LAB</span>
              </a>

              <a
                href="#forensics"
                onClick={() => audio.click()}
                className="inline-flex items-center gap-2 rounded-sm border border-[#232936] bg-[#0e1117] px-5 py-3 text-xs font-mono font-semibold text-[#f3f4f6] transition-all hover:border-[#06b6d4] hover:text-[#06b6d4]"
              >
                <Binary size={14} />
                <span>FILO & NEMUE TOOLING</span>
              </a>
            </div>

            {/* Real-Time Telemetry Bar */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#232936] pt-6 font-mono text-xs">
              <div className="rounded-lg border border-[#232936] bg-[#0e1117]/60 p-3">
                <span className="block text-[10px] text-[#9ca3af] uppercase">CAMPUS LAB</span>
                <span className="block mt-1 text-sm font-bold text-[#10b981] glow-emerald">34 CONTAINERS</span>
              </div>
              <div className="rounded-lg border border-[#232936] bg-[#0e1117]/60 p-3">
                <span className="block text-[10px] text-[#9ca3af] uppercase">IDENTITY LAYER</span>
                <span className="block mt-1 text-sm font-bold text-[#06b6d4]">AUTHENTIK OIDC</span>
              </div>
              <div className="rounded-lg border border-[#232936] bg-[#0e1117]/60 p-3">
                <span className="block text-[10px] text-[#9ca3af] uppercase">BINARY ENGINES</span>
                <span className="block mt-1 text-sm font-bold text-[#f3f4f6]">GO 1.23 & RUST</span>
              </div>
            </div>
          </div>

          {/* Right Column: The 3D Interactive Cyber Companion Avatar */}
          <div className="lg:col-span-5 flex justify-center">
            <AvatarCompanion activeSection={activeSection} />
          </div>
        </div>
      </div>
    </section>
  );
}
