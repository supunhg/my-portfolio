"use client";

import { Award, BookOpen, CheckCircle, Layers, Cpu, ShieldCheck } from "lucide-react";
import { audio } from "@/lib/audio";

export function SpecSheet() {
  const specs = [
    {
      category: "SYSTEMS & INFRASTRUCTURE",
      items: [
        "VMware ESXi Bare-Metal Hypervisor",
        "Ubuntu 24.04 LTS, Debian, Alpine Linux",
        "Docker Engine & Multi-Container Compose Fleets",
        "ZeroTier Software-Defined Overlay Networks",
        "systemd Daemons, PKI & mTLS Architecture",
      ],
    },
    {
      category: "OFFENSIVE SECURITY & IDENTITY",
      items: [
        "Authentik IAM (OIDC, LDAP, SSO Ingress)",
        "Forward-Auth & Dual-Lock Reverse Proxies",
        "Scoped Ephemeral API Key Gateways (Qdrant)",
        "Network Pivoting & Privilege Escalation (GTFOBins)",
        "Vulnerability Assessment & Responsible Disclosure",
      ],
    },
    {
      category: "SYSTEMS PROGRAMMING",
      items: [
        "Go 1.23 (Filo Forensic Engine, CLI Architecture)",
        "Rust (Nemue High-Speed Network Recon Scanner)",
        "Python 3.12 (Blender bpy Automation, Scanners)",
        "TypeScript / JavaScript (Next.js 16, Three.js)",
        "C / C# (Low-level systems fundamentals)",
      ],
    },
    {
      category: "APPLIED 3D & GRAPHICS",
      items: [
        "Blender 5.2 Procedural Modeling (sclib)",
        "Three.js WebGL Interactive Shaders",
        "Ray-traced Vertex Ambient Occlusion Baking",
        "Web Audio API Procedural Synthesizers",
        "Meshopt Quantization (Sub-50KB WebGL Delivery)",
      ],
    },
  ];

  return (
    <section id="specs" className="border-b border-[#232936] bg-[#08090c] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#232936]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#06b6d4]">
              <Layers size={12} />
              <span>TECHNICAL VERIFICATION // SPEC SHEET</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#f3f4f6]">
              Verified Capabilities & Academic Record.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#9ca3af] leading-relaxed font-mono">
            Every layer from bare-metal virtualization to network protocols and memory inspection is selected for high assurance and zero bloat.
          </p>
        </div>

        {/* Academic Highlights */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 font-mono">
          <div
            onMouseEnter={() => audio.dialTick()}
            className="cyber-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-2 text-[#10b981]">
              <Award size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                ACADEMIC EXCELLENCE
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#f3f4f6]">
              Diploma in Computer System Design
            </h3>
            <p className="mt-1 text-sm font-bold text-[#10b981] glow-emerald">
              GPA: 3.83 / 4.0
            </p>
            <p className="mt-2 text-xs text-[#9ca3af] leading-relaxed font-sans">
              National Institute of Business Management (NIBM). Groundwork in OS internals, algorithms, and distributed computing.
            </p>
          </div>

          <div
            onMouseEnter={() => audio.dialTick()}
            className="cyber-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-2 text-[#06b6d4]">
              <BookOpen size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                ACTIVE UNDERGRADUATE
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#f3f4f6]">
              HND in Network Security
            </h3>
            <p className="mt-1 text-sm font-bold text-[#06b6d4]">
              Ethical Hacking & Defense
            </p>
            <p className="mt-2 text-xs text-[#9ca3af] leading-relaxed font-sans">
              Advanced offensive security methodologies, penetration testing, malware reverse engineering, and identity perimeter hardening.
            </p>
          </div>

          <div
            onMouseEnter={() => audio.dialTick()}
            className="cyber-panel rounded-xl p-6"
          >
            <div className="flex items-center gap-2 text-[#ff5a1f]">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                OFFENSIVE CERTIFICATIONS
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#f3f4f6]">
              Industry Credentials Focus
            </h3>
            <p className="mt-1 text-sm font-bold text-[#ff5a1f]">
              OSCP · CEH · eJPT
            </p>
            <p className="mt-2 text-xs text-[#9ca3af] leading-relaxed font-sans">
              Rigorous laboratory preparation in Active Directory exploitation, binary exploitation, and defensive fortification.
            </p>
          </div>
        </div>

        {/* 4-Column Technical Matrix */}
        <div className="mt-8 rounded-xl border border-[#232936] bg-[#0e1117] divide-y md:divide-y-0 md:divide-x divide-[#232936] grid grid-cols-1 md:grid-cols-4 shadow-xl">
          {specs.map((group, idx) => (
            <div key={idx} className="p-6">
              <span className="block font-mono text-[11px] font-bold text-[#06b6d4] tracking-wider mb-4">
                // {group.category}
              </span>
              <ul className="space-y-3 font-mono">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#9ca3af] leading-snug">
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
