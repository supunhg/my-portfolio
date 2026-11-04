"use client";

import { Shield, Fingerprint, Compass, Lock, Zap, Terminal } from "lucide-react";
import { audio } from "@/lib/audio";

export function Philosophy() {
  const tenets = [
    {
      icon: <Fingerprint className="text-[#06b6d4]" size={20} />,
      kicker: "// PRINCIPLE 01",
      title: "Identity Precedes All Ingress",
      description:
        "Once one system owns 'who is this person' via Authentik OIDC, reverse proxies, dashboards, and scoped Qdrant vector DB keys become simple group lookups. Compromise or revoke one account, and access cuts across 34 containers in 120 seconds.",
    },
    {
      icon: <Shield className="text-[#10b981]" size={20} />,
      kicker: "// PRINCIPLE 02",
      title: "Attack to Fortify",
      description:
        "As an Ethical Hacking & Network Security undergraduate, I treat my own servers as the adversary target. Auditing Docker iptables bypasses, mutual TLS, and API key scoping myself is the only way to prove a system can withstand hostile environments.",
    },
    {
      icon: <Compass className="text-[#f59e0b]" size={20} />,
      kicker: "// PRINCIPLE 03",
      title: "Physical Precision & Zero Bloat",
      description:
        "Heavy defense engineering does not mean clunky, sluggish software. Every tool is compiled natively (Go & Rust), and every 3D model is mathematically baked in Blender down to 35 KB for instant 60 FPS execution.",
    },
  ];

  return (
    <section className="border-b border-[#232936] bg-[#08090c] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#232936]">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-bold text-[#06b6d4] tracking-widest uppercase">
              // ENGINEERING CORE DIRECTIVES
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f3f4f6]">
              How I architect systems meant to endure.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#9ca3af] leading-relaxed font-mono">
            From ESXi hypervisors to Go forensics and WebGL shaders: absolute defense-in-depth under the hood, and surgical precision on the surface.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {tenets.map((tenet, idx) => (
            <div
              key={idx}
              onMouseEnter={() => audio.dialTick()}
              className="cyber-panel relative rounded-xl p-8 transition-all hover:-translate-y-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#232936] bg-[#141822]">
                {tenet.icon}
              </div>
              <span className="mt-6 block font-mono text-[11px] font-bold text-[#9ca3af] tracking-wider">
                {tenet.kicker}
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#f3f4f6] tracking-tight">
                {tenet.title}
              </h3>
              <p className="mt-3 text-sm text-[#9ca3af] leading-relaxed">
                {tenet.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
