"use client";

import { Sparkles, Music, Utensils, Waves, Dumbbell, ArrowUpRight, ExternalLink } from "lucide-react";
import { audio } from "@/lib/audio";

export function PillarCreative() {
  const templates = [
    {
      id: "wren",
      name: "Wren // Playable 3D Synthesizer",
      tagline: "A product page you can play: real Web Audio synth, physics patch cables, scroll exploded view.",
      icon: <Music size={18} className="text-[#ff5a1f]" />,
      stack: "Next.js 16 · Three.js · Cannon-es · Web Audio",
      size: "138 KB GLB",
      liveUrl: "https://supercub-wren.vercel.app/",
      githubUrl: "https://github.com/supunhg/supercub-wren",
    },
    {
      id: "mise",
      name: "Mise // Procedural Culinary Ordering",
      tagline: "Editorial restaurant ordering with 3D ramen bowl and procedural ingredients in Blender.",
      icon: <Utensils size={18} className="text-[#10b981]" />,
      stack: "Next.js 16 · Tailwind CSS 4 · Procedural GLTF",
      size: "129 KB GLB",
      liveUrl: "https://supercub-mise.vercel.app/",
      githubUrl: "https://github.com/supunhg/supercub-mise",
    },
    {
      id: "tidehouse",
      name: "Tidehouse // Coastal Residence Booking",
      tagline: "Boutique coastal stay with local-time-aware 3D topography and direct 4-step booking.",
      icon: <Waves size={18} className="text-[#2563eb]" />,
      stack: "Next.js 16 · Time-Aware Sun Shaders · iCal Export",
      size: "45 KB GLB",
      liveUrl: "https://supercub-tidehouse.vercel.app/",
      githubUrl: "https://github.com/supunhg/supercub-tidehouse",
    },
    {
      id: "tempo",
      name: "Tempo // Movement Studio & Spot Picker",
      tagline: "Tactile studio scheduling with 3D room map spot-picking and waitlist mechanics.",
      icon: <Dumbbell size={18} className="text-[#f59e0b]" />,
      stack: "Next.js 16 · Motion · 3D Spot Picker",
      size: "69 KB GLB",
      liveUrl: "https://supercub-tempo.vercel.app/",
      githubUrl: "https://github.com/supunhg/supercub-tempo",
    },
  ];

  return (
    <section id="creative" className="border-b border-[#e5e1d8] bg-[#f8f7f4] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#e5e1d8]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#ff5a1f]">
              <Sparkles size={12} />
              <span>CREATIVE 3D & DIGITAL PRODUCTS // SUPERCUB</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#141619]">
              Physical computing meets web craft.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#52565e] leading-relaxed">
            I don’t just write backends—I design interactive 3D products with physics,
            procedural audio, and Blender Python pipelines that run at 60 FPS on mobile. Click any card to launch the live application.
          </p>
        </div>

        {/* 4 Supercub Templates Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onMouseEnter={() => audio.dialTick()}
              className="group relative rounded-xl border border-[#e5e1d8] bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#141619] hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#e5e1d8] bg-[#f8f7f4]">
                    {tpl.icon}
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[#646872] bg-[#f8f7f4] px-2 py-0.5 rounded border border-[#e5e1d8]">
                    {tpl.size}
                  </span>
                </div>

                <a
                  href={tpl.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => audio.click()}
                  className="block mt-5"
                >
                  <h3 className="text-xl font-bold text-[#141619] tracking-tight group-hover:text-[#ff5a1f] transition-colors flex items-center gap-2">
                    <span>{tpl.name}</span>
                    <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ff5a1f]" />
                  </h3>
                  <p className="mt-2 text-sm text-[#52565e] leading-relaxed">
                    {tpl.tagline}
                  </p>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e5e1d8] flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#646872]">
                  {tpl.stack}
                </span>

                <div className="flex items-center gap-3">
                  <a
                    href={tpl.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => audio.click()}
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#141619] hover:text-[#ff5a1f] transition-colors"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight size={13} />
                  </a>
                  <span className="text-[#cfc7ba] font-mono">/</span>
                  <a
                    href={tpl.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => audio.click()}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#646872] hover:text-[#141619] transition-colors"
                  >
                    <span>Source</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Procedural Blender Pipeline Callout */}
        <div className="mt-8 rounded-xl border border-[#e5e1d8] bg-[#ebe7df] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="font-mono text-xs font-bold text-[#141619] uppercase tracking-wider">
                // THE ZERO-DOWNLOAD 3D PIPELINE
              </span>
              <h3 className="mt-1 text-xl font-bold text-[#141619]">
                Modeled in Code (Blender 5.2 Python) · Baked Vertex AO · Meshopt
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#52565e] leading-relaxed">
                Every 3D model is generated procedurally from Python scripts (`sclib.py`), with ambient occlusion baked
                directly into vertex attributes. Processed via `gltf-transform` with meshopt quantization, dropping
                multi-megabyte meshes to under 150 KB.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded border border-[#d4cfc4] bg-white px-3 py-2 text-center font-mono text-xs shadow-xs">
                <span className="block text-[10px] text-[#646872]">RAW MESH</span>
                <span className="font-bold text-[#141619]">4.1 MB</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#ff5a1f]">→</span>
              <div className="rounded border border-[#ff5a1f]/30 bg-white px-3 py-2 text-center font-mono text-xs shadow-xs">
                <span className="block text-[10px] text-[#ff5a1f]">OPTIMIZED</span>
                <span className="font-bold text-[#10b981]">59.4 KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
