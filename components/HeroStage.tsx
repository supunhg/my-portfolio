"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, RotateCcw, Sparkles, Sliders, Info, Cpu, HardDrive, Radio } from "lucide-react";
import { Stage } from "@/lib/stage/stage";
import type { PartHit } from "@/lib/stage/model";
import { audio } from "@/lib/audio";

export function HeroStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<PartHit>(null);
  const [activeNote, setActiveNote] = useState<string>(
    "Unit-01: Drag to orbit. Click keys, dials, or cartridges to interact."
  );

  useEffect(() => {
    let alive = true;

    const init = async () => {
      if (!canvasRef.current) return;
      try {
        const stage = await Stage.create(canvasRef.current, {
          onProgress: (p) => {
            if (alive) setLoadProgress(Math.round(p * 100));
          },
          onHoverPart: (hit) => {
            if (!alive) return;
            setHoveredPart(hit);
            if (hit) {
              if (hit.type === "key") setActiveNote(`Tactile Key 0${hit.index + 1} clicked`);
              else if (hit.type === "knob_main") setActiveNote("Machined rotary encoder (knurled aluminum)");
              else if (hit.type === "knob_aux") setActiveNote("Auxiliary brass fine-trim dial");
              else if (hit.type === "cartridge" && hit.id === "lab")
                setActiveNote("Module 01: NIBM Campus Infrastructure (34 Containers, Authentik)");
              else if (hit.type === "cartridge" && hit.id === "filo")
                setActiveNote("Module 02: Filo (Go-Native Forensic Binary Analysis)");
              else if (hit.type === "cartridge" && hit.id === "nemue")
                setActiveNote("Module 03: Nemue (High-Speed Rust Network Recon)");
              else if (hit.type === "screen") setActiveNote("OLED telemetry viewport");
              else if (hit.type === "switch") setActiveNote("Master security bus rocker switch");
            }
          },
          onClickPart: (hit) => {
            if (!alive || !hit) return;
            if (hit.type === "cartridge") {
              const element = document.getElementById(
                hit.id === "lab" ? "infrastructure" : "forensics"
              );
              element?.scrollIntoView({ behavior: "smooth" });
            }
          },
        });

        if (!alive) {
          stage.dispose();
          return;
        }

        stageRef.current = stage;
        setLoading(false);
      } catch (err) {
        console.error("Failed to load Unit-01 stage:", err);
      }
    };

    init();

    return () => {
      alive = false;
      stageRef.current?.dispose();
    };
  }, []);

  const toggleExplode = () => {
    const next = !isExploded;
    setIsExploded(next);
    stageRef.current?.setExplode(next ? 1.0 : 0.0);
    audio.switchSnap();
  };

  const handleReset = () => {
    stageRef.current?.resetRotation();
    stageRef.current?.setExplode(0.0);
    setIsExploded(false);
    audio.click();
  };

  return (
    <section className="relative overflow-hidden border-b border-[#e5e1d8] bg-gradient-to-b from-[#f8f7f4] via-[#f3f0e8] to-[#f8f7f4] pt-8 pb-16">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Pitch */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e1d8] bg-white/80 px-3 py-1 font-mono text-[11px] font-semibold text-[#646872] shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
            <span>UNIT-01 // PROCEDURAL 3D ARTIFACT · MODELED IN BLENDER 5.2</span>
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-[#141619] leading-[1.08]">
            Heavy-duty infrastructure. <br />
            <span className="text-[#ff5a1f]">Tactile digital craft.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#52565e] leading-relaxed">
            I engineer resilient campus-scale platforms, forensic binaries in Go & Rust,
            and tactile 3D physical computing experiences—built with institutional security and obsessive finish.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#infrastructure"
              onClick={() => audio.click()}
              className="btn-tactile inline-flex items-center gap-2 rounded-sm bg-[#141619] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#ff5a1f]"
            >
              <Cpu size={14} />
              <span>Explore NIBM Infrastructure</span>
            </a>
            <a
              href="#forensics"
              onClick={() => audio.click()}
              className="btn-tactile inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-white px-5 py-2.5 text-xs font-semibold text-[#141619] transition-all hover:border-[#141619]"
            >
              <HardDrive size={14} />
              <span>Forensics & Tooling</span>
            </a>
          </div>
        </div>

        {/* 3D Viewport Stage Box */}
        <div className="relative mt-10 rounded-xl border border-[#e5e1d8] bg-white shadow-lg overflow-hidden">
          {/* Header Bar */}
          <div className="flex h-11 items-center justify-between border-b border-[#e5e1d8] bg-[#f8f7f4] px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#141619]" />
              <span className="font-mono text-xs font-bold text-[#141619] tracking-wider uppercase">
                SYSTEM UNIT-01 // INTERACTIVE DECK
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleExplode}
                className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                  isExploded
                    ? "bg-[#ff5a1f] text-white"
                    : "border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#141619]"
                }`}
              >
                <Layers size={12} />
                <span>{isExploded ? "Assembled" : "Explode Parts"}</span>
              </button>

              <button
                onClick={handleReset}
                title="Reset view"
                className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#141619]"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative h-[480px] sm:h-[580px] w-full bg-[#ebe7df] cursor-grab active:cursor-grabbing">
            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#ebe7df]/90 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#141619]">
                  <Sparkles size={14} className="animate-spin text-[#ff5a1f]" />
                  <span>INITIALIZING UNIT-01 3D MESH ({loadProgress}%)</span>
                </div>
                <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-[#d4cfc4]">
                  <div
                    className="h-full bg-[#ff5a1f] transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <span className="mt-2 text-[10px] font-mono text-[#646872]">
                  Ray-traced AO · Vertex baked · Meshopt 60KB
                </span>
              </div>
            )}

            <canvas ref={canvasRef} className="h-full w-full" />

            {/* Interactive Callout Chips on viewport */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto rounded-sm border border-[#e5e1d8] bg-white/90 px-3 py-1.5 font-mono text-xs text-[#141619] shadow-xs backdrop-blur-md">
                <span className="text-[#ff5a1f] font-bold">INFO: </span>
                <span>{activeNote}</span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => {
                    stageRef.current?.model.interactWith({ type: "key", index: 3 });
                  }}
                  className="rounded-sm border border-[#e5e1d8] bg-white px-2 py-1 font-mono text-[10px] text-[#141619] shadow-xs hover:border-[#ff5a1f]"
                >
                  Click Key
                </button>
                <button
                  onClick={() => {
                    stageRef.current?.model.interactWith({ type: "knob_main" });
                  }}
                  className="rounded-sm border border-[#e5e1d8] bg-white px-2 py-1 font-mono text-[10px] text-[#141619] shadow-xs hover:border-[#ff5a1f]"
                >
                  Turn Dial
                </button>
                <button
                  onClick={() => {
                    stageRef.current?.model.interactWith({ type: "cartridge", id: "lab" });
                  }}
                  className="rounded-sm border border-[#e5e1d8] bg-white px-2 py-1 font-mono text-[10px] text-[#141619] shadow-xs hover:border-[#ff5a1f]"
                >
                  Pop Cartridge
                </button>
              </div>
            </div>
          </div>

          {/* Quick-Spec Bar */}
          <div className="grid grid-cols-2 divide-x divide-[#e5e1d8] border-t border-[#e5e1d8] bg-[#f8f7f4] sm:grid-cols-4">
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Asset Size</span>
              <span className="font-mono text-xs font-bold text-[#141619]">59.4 KB (Meshopt)</span>
            </div>
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Renderer</span>
              <span className="font-mono text-xs font-bold text-[#141619]">Blender 5.2 -&gt; WebGL</span>
            </div>
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Frame Budget</span>
              <span className="font-mono text-xs font-bold text-[#10b981]">60 FPS Locked</span>
            </div>
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Materials</span>
              <span className="font-mono text-xs font-bold text-[#141619]">Raytraced AO Vertex</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
