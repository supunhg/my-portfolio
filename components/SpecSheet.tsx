"use client";

import { Award, BookOpen, CheckCircle, Terminal, Layers, Cpu, ShieldAlert, Target } from "lucide-react";
import { audio } from "@/lib/audio";

export function SpecSheet() {
  const specs = [
    {
      category: "CORE RUNTIMES & SYSTEMS",
      items: [
        "Linux (Ubuntu 24.04 LTS, Alpine, Debian)",
        "VMware ESXi Hypervisor",
        "Docker Engine & Compose Fleets",
        "ZeroTier Software-Defined Networks",
        "systemd Daemons & PKI Architecture",
      ],
    },
    {
      category: "SYSTEMS PROGRAMMING",
      items: [
        "Go 1.23 (Filo Forensic Engine, CLI Architecture)",
        "Rust (Nemue High-Speed Network Recon)",
        "Python 3.12 (Blender bpy Procedural 3D, Automation)",
        "TypeScript / JavaScript (Next.js 16, Three.js)",
      ],
    },
    {
      category: "IDENTITY & ASSURANCE",
      items: [
        "Authentik OIDC / LDAP Single Sign-On",
        "Forward Auth & Dual-Lock Reverse Proxies",
        "Scoped API Key Minting (Qdrant Vector DB)",
        "Mutual TLS (mTLS) & Encrypted Backups (Restic)",
      ],
    },
    {
      category: "3D GRAPHICS & AUDIO",
      items: [
        "Blender 5.2 Procedural Modeling (sclib)",
        "Three.js WebGL Interactive Scenes",
        "Ray-traced Vertex Ambient Occlusion Baking",
        "Web Audio API Procedural Synthesizers",
        "Meshopt & Draco Quantization Pipelines",
      ],
    },
  ];

  return (
    <section id="specs" className="border-b border-[#e5e1d8] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#e5e1d8]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-[#f8f7f4] px-2.5 py-1 font-mono text-[11px] font-bold text-[#141619]">
              <Layers size={12} />
              <span>TECHNICAL DOSSIER // VERIFIED SPECIFICATIONS</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#141619]">
              Architectural Specifications.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#52565e] leading-relaxed">
            Every layer from silicon and virtualization to user-facing WebGL components
            is selected for verifiable reliability, speed, and defense-in-depth.
          </p>
        </div>

        {/* Academic & Professional Milestones */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Box 1 */}
          <div
            onMouseEnter={() => audio.dialTick()}
            className="rounded-xl border border-[#e5e1d8] bg-[#f8f7f4] p-6 shadow-xs"
          >
            <div className="flex items-center gap-2 text-[#ff5a1f]">
              <Award size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                ACADEMIC EXCELLENCE
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#141619]">
              Diploma in Computer System Design
            </h3>
            <p className="mt-1 font-mono text-sm font-semibold text-[#10b981]">
              GPA: 3.83 / 4.0
            </p>
            <p className="mt-2 text-xs text-[#52565e] leading-relaxed">
              National Institute of Business Management (NIBM). Groundwork in OS internals, data structures, network protocols, and distributed architecture.
            </p>
          </div>

          {/* Box 2 */}
          <div
            onMouseEnter={() => audio.dialTick()}
            className="rounded-xl border border-[#e5e1d8] bg-[#f8f7f4] p-6 shadow-xs"
          >
            <div className="flex items-center gap-2 text-[#2563eb]">
              <BookOpen size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                CURRENT UNDERGRADUATE
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#141619]">
              HND in Network Security
            </h3>
            <p className="mt-1 font-mono text-sm font-semibold text-[#2563eb]">
              Ethical Hacking & Network Security
            </p>
            <p className="mt-2 text-xs text-[#52565e] leading-relaxed">
              Advanced offensive security methodologies, penetration testing, malware reverse engineering, and institutional identity management.
            </p>
          </div>

          {/* Box 3 */}
          <div
            onMouseEnter={() => audio.dialTick()}
            className="rounded-xl border border-[#e5e1d8] bg-[#f8f7f4] p-6 shadow-xs"
          >
            <div className="flex items-center gap-2 text-[#ff5a1f]">
              <Target size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                TARGET CREDENTIALS // IN PREPARATION
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#141619]">
              OSCP · CEH · eJPT
            </h3>
            <p className="mt-1 font-mono text-sm font-semibold text-[#646872]">
              Active Laboratory Training
            </p>
            <p className="mt-2 text-xs text-[#52565e] leading-relaxed">
              Rigorous hands-on training in dedicated offensive security labs (Active Directory exploitation, network pivoting, binary analysis, and defensive fortification).
            </p>
          </div>
        </div>

        {/* 4-Column Technical Matrix */}
        <div className="mt-8 rounded-xl border border-[#e5e1d8] bg-white divide-y md:divide-y-0 md:divide-x divide-[#e5e1d8] grid grid-cols-1 md:grid-cols-4 shadow-xs">
          {specs.map((group, idx) => (
            <div key={idx} className="p-6">
              <span className="block font-mono text-[11px] font-bold text-[#ff5a1f] tracking-wider mb-4">
                // {group.category}
              </span>
              <ul className="space-y-3">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#52565e] leading-snug">
                    <CheckCircle size={13} className="text-[#10b981] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
