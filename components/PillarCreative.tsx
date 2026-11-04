"use client";

import { Sparkles, Music, Utensils, Waves, Dumbbell, ArrowUpRight, Box } from "lucide-react";
import { audio } from "@/lib/audio";

export function PillarCreative() {
  const templates = [
    {
      id: "wren",
      name: "Wren // Playable 3D Synthesizer",
      tagline: "A product page you can play: Web Audio synth, physics patch cables, exploded view.",
      icon: <Music size={18} className="text-[#06b6d4]" />,
      stack: "Next.js 16 · Three.js · Cannon-es · Web Audio",
      size: "138 KB GLB",
      link: "https://github.com/supunhg/supercub-wren",
    },
    {
      id: "mise",
      name: "Mise // Procedural Culinary Ordering",
      tagline: "Editorial restaurant ordering with 3D ramen bowl and procedural ingredients in Blender.",
      icon: <Utensils size={18} className="text-[#10b981]" />,
      stack: "Next.js 16 · Tailwind 4 · Procedural GLTF",
      size: "129 KB GLB",
      link: "https://github.com/supunhg/supercub-mise",
    },
    {
      id: "tidehouse",
      name: "Tidehouse // Coastal Residence Booking",
      tagline: "Boutique coastal stay with local-time-aware 3D topography and direct booking flow.",
      icon: <Waves size={18} className="text-[#3b82f6]" />,
      stack: "Next.js 16 · Time-Aware Sun Shaders · iCal Export",
      size: "45 KB GLB",
      link: "https://github.com/supunhg/supercub-tidehouse",
    },
    {
      id: "tempo",
      name: "Tempo // Movement Studio & Spot Picker",
      tagline: "Tactile studio scheduling with 3D room map spot-picking and waitlist mechanics.",
      icon: <Dumbbell size={18} className="text-[#f59e0b]" />,
      stack: "Next.js 16 · Motion · 3D Spot Picker",
      size: "69 KB GLB",
      link: "https://github.com/supunhg/supercub-tempo",
    },
  ];

  return (
    <section id="creative" className="border-b border-[#232936] bg-[#0b0e14] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#232936]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#06b6d4]">
              <Sparkles size={12} />
              <span>APPLIED 3D & FULL-STACK CRAFT // SUPERCUB</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#f3f4f6]">
              Creative engineering meets procedural graphics.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#9ca3af] leading-relaxed font-mono">
            Beyond kernel and network security, I engineer interactive WebGL products with real physics,
            procedural audio, and Blender Python pipelines running locked at 60 FPS.
          </p>
        </div>

        {/* 4 Templates Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onMouseEnter={() => audio.dialTick()}
              className="cyber-panel rounded-xl p-7 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#232936] bg-[#0e1117]">
                    {tpl.icon}
                  </div>
                  <span className="font-mono text-[11px] text-[#06b6d4] bg-[#0e1117] px-2 py-0.5 rounded border border-[#232936]">
                    {tpl.size}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#f3f4f6] tracking-tight group-hover:text-[#06b6d4] transition-colors">
                  {tpl.name}
                </h3>
                <p className="mt-2 text-sm text-[#9ca3af] leading-relaxed">
                  {tpl.tagline}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#232936] flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#9ca3af]">
                  {tpl.stack}
                </span>
                <a
                  href={tpl.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#06b6d4] group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Code</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Zero-Bloat Blender Pipeline */}
        <div className="mt-8 rounded-xl border border-[#232936] bg-[#0e1117] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="font-mono text-xs font-bold text-[#06b6d4] uppercase tracking-wider">
                // ZERO-BLOAT 3D PIPELINE
              </span>
              <h3 className="mt-1 text-xl font-bold text-[#f3f4f6]">
                Modeled in Python (Blender 5.2) · Baked Vertex AO · Meshopt 35 KB
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                The Sentinel-01 Avatar and all 3D assets are written as code in Blender Python (`sclib.py`), with ambient occlusion baked into vertex layers and quantized via `gltf-transform`. No sluggish textures, no lag, instant hydration.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded border border-[#232936] bg-[#08090c] px-3 py-2 text-center font-mono text-xs">
                <span className="block text-[10px] text-[#9ca3af]">SENTINEL BOT</span>
                <span className="font-bold text-[#10b981]">35.8 KB</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#06b6d4]">→</span>
              <div className="rounded border border-[#06b6d4]/40 bg-[#08090c] px-3 py-2 text-center font-mono text-xs">
                <span className="block text-[10px] text-[#06b6d4]">FPS BUDGET</span>
                <span className="font-bold text-[#06b6d4]">60 FPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
