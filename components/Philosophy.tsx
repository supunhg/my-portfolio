"use client";

import { Shield, Fingerprint, Cpu, Compass, Lock, Zap } from "lucide-react";
import { audio } from "@/lib/audio";

export function Philosophy() {
  const tenets = [
    {
      icon: <Fingerprint className="text-[#ff5a1f]" size={20} />,
      kicker: "PRINCIPLE 01",
      title: "Identity Precedes Everything",
      description:
        "Once one system owns 'who is this person', dashboards, scoped vector DB API keys, access revocation, and offboarding collapse into simple OIDC group lookups. Zero fragmented passwords.",
    },
    {
      icon: <Shield className="text-[#2563eb]" size={20} />,
      kicker: "PRINCIPLE 02",
      title: "Attack to Defend",
      description:
        "As an Ethical Hacking & Network Security engineer, I treat every system I build as the target first. Penetration testing your own architecture reveals the blind spots before attackers do.",
    },
    {
      icon: <Compass className="text-[#141619]" size={20} />,
      kicker: "PRINCIPLE 03",
      title: "Tactile Physicality & Polish",
      description:
        "High-assurance security doesn't have to look sterile or dull. Great engineering deserves physical delight—procedural sound, crisp typography, and 3D precision inspired by Dieter Rams and Teenage Engineering.",
    },
  ];

  return (
    <section className="border-b border-[#e5e1d8] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#e5e1d8]">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-bold text-[#ff5a1f] tracking-widest uppercase">
              // ENGINEERING ETHOS
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141619]">
              How I architect systems meant to endure.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#52565e] leading-relaxed">
            From bare-metal ESXi hypervisors to Go-native forensics and WebGL 3D,
            the benchmark is the same: absolute security under the hood, and pure craftsmanship on the surface.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {tenets.map((tenet, idx) => (
            <div
              key={idx}
              onMouseEnter={() => audio.dialTick()}
              className="group relative rounded-lg border border-[#e5e1d8] bg-[#f8f7f4] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[#141619] hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#e5e1d8] bg-white shadow-xs">
                {tenet.icon}
              </div>
              <span className="mt-6 block font-mono text-[11px] font-bold text-[#646872] tracking-wider">
                {tenet.kicker}
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#141619] tracking-tight">
                {tenet.title}
              </h3>
              <p className="mt-3 text-sm text-[#52565e] leading-relaxed">
                {tenet.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
