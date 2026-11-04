"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Sparkles, Server, Terminal, Gamepad2, Radio, Compass, ArrowUpRight } from "lucide-react";
import { DioramaStage, type CameraPreset } from "@/lib/stage/dioramaStage";
import type { DioramaHit } from "@/lib/stage/dioramaModel";
import { audio } from "@/lib/audio";

export function HeroStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<DioramaStage | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activePreset, setActivePreset] = useState<CameraPreset>("overview");
  const [hoveredHit, setHoveredHit] = useState<DioramaHit>(null);
  const [activeNote, setActiveNote] = useState<string>(
    "Drag to orbit outpost · Scroll to zoom · Click street signs or props to navigate"
  );

  useEffect(() => {
    let alive = true;

    const init = async () => {
      if (!canvasRef.current) return;
      try {
        const stage = await DioramaStage.create(canvasRef.current, {
          onProgress: (p) => {
            if (alive) setLoadProgress(Math.round(p * 100));
          },
          onHoverHit: (hit) => {
            if (!alive) return;
            setHoveredHit(hit);
            if (hit) {
              setActiveNote(hit.label);
            } else {
              setActiveNote("Drag to orbit outpost · Scroll to zoom · Click street signs or props to navigate");
            }
          },
          onClickHit: (hit) => {
            if (!alive || !hit) return;
            setActiveNote(`Selected: ${hit.label}`);
          },
        });

        if (!alive) {
          stage.dispose();
          return;
        }

        stageRef.current = stage;
        setLoading(false);
      } catch (err) {
        console.error("Failed to load Diorama stage:", err);
      }
    };

    init();

    return () => {
      alive = false;
      stageRef.current?.dispose();
    };
  }, []);

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    stageRef.current?.setPreset(preset);
  };

  const handleReset = () => {
    setActivePreset("overview");
    stageRef.current?.resetCamera();
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
            <span>NODE-01 // CYBERSECURITY &amp; INFRASTRUCTURE DIORAMA · BLENDER 5.2</span>
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-[#141619] leading-[1.08]">
            Heavy-duty infrastructure. <br />
            <span className="text-[#ff5a1f]">Obsessive 3D craft.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#52565e] leading-relaxed">
            I engineer resilient campus hypervisors, forensic engines in Go &amp; Rust,
            and interactive 3D computing experiences—built with institutional rigor and physical polish.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#lab"
              onClick={() => audio.click()}
              className="btn-tactile inline-flex items-center gap-2 rounded-sm bg-[#141619] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#ff5a1f]"
            >
              <Server size={14} />
              <span>Explore Campus Infrastructure</span>
            </a>
            <a
              href="#forensics"
              onClick={() => audio.click()}
              className="btn-tactile inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-white px-5 py-2.5 text-xs font-semibold text-[#141619] transition-all hover:border-[#141619]"
            >
              <Terminal size={14} />
              <span>Forensic Tooling (Filo)</span>
            </a>
            <a
              href="#creative"
              onClick={() => audio.click()}
              className="btn-tactile inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-white px-5 py-2.5 text-xs font-semibold text-[#141619] transition-all hover:border-[#141619]"
            >
              <Compass size={14} />
              <span>3D Digital Products (Supercub)</span>
            </a>
          </div>
        </div>

        {/* 3D Viewport Stage Box */}
        <div className="relative mt-10 rounded-xl border border-[#e5e1d8] bg-white shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#e5e1d8] bg-[#f8f7f4] px-4 py-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
              <span className="font-mono text-xs font-bold text-[#141619] tracking-wider uppercase">
                CYBER OUTPOST // SEC-LAB 01 DIORAMA
              </span>
            </div>

            {/* Camera Presets Selector (Bruno Simon / Level Style) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#646872] uppercase mr-1 hidden sm:inline">Camera:</span>
              <button
                onClick={() => handleSelectPreset("overview")}
                className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                  activePreset === "overview"
                    ? "bg-[#141619] text-white shadow-xs"
                    : "border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#141619]"
                }`}
              >
                <Compass size={12} />
                <span>Overview 360°</span>
              </button>
              <button
                onClick={() => handleSelectPreset("server")}
                className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                  activePreset === "server"
                    ? "bg-[#06b6d4] text-white shadow-xs"
                    : "border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#06b6d4]"
                }`}
              >
                <Server size={12} />
                <span>ESXi Rack</span>
              </button>
              <button
                onClick={() => handleSelectPreset("workstation")}
                className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                  activePreset === "workstation"
                    ? "bg-[#10b981] text-white shadow-xs"
                    : "border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#10b981]"
                }`}
              >
                <Terminal size={12} />
                <span>Workstation</span>
              </button>
              <button
                onClick={() => handleSelectPreset("arcade")}
                className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                  activePreset === "arcade"
                    ? "bg-[#ff5a1f] text-white shadow-xs"
                    : "border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#ff5a1f]"
                }`}
              >
                <Gamepad2 size={12} />
                <span>Filo Arcade</span>
              </button>
              <button
                onClick={() => handleSelectPreset("telemetry")}
                className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                  activePreset === "telemetry"
                    ? "bg-[#8b5cf6] text-white shadow-xs"
                    : "border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#8b5cf6]"
                }`}
              >
                <Radio size={12} />
                <span>Telemetry Dish</span>
              </button>

              <button
                onClick={handleReset}
                title="Reset Camera View"
                className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#e5e1d8] bg-white text-[#141619] hover:border-[#141619]"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative h-[520px] sm:h-[640px] w-full bg-[#0c1017] cursor-grab active:cursor-grabbing select-none">
            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0c1017]/95 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <Sparkles size={16} className="animate-spin text-[#06b6d4]" />
                  <span>INITIALIZING CYBER OUTPOST DIORAMA ({loadProgress}%)</span>
                </div>
                <div className="mt-3 h-1.5 w-56 overflow-hidden rounded-full bg-[#1e293b]">
                  <div
                    className="h-full bg-gradient-to-r from-[#06b6d4] to-[#ff5a1f] transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <span className="mt-2 text-[10px] font-mono text-[#94a3b8]">
                  Blender 5.2 LTS · Raytraced AO Vertex Baked · 329 KB Meshopt
                </span>
              </div>
            )}

            <canvas ref={canvasRef} className="h-full w-full block" />

            {/* Interactive Callout Chips on viewport */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto max-w-full rounded-md border border-white/10 bg-[#0f172a]/90 px-3.5 py-2 font-mono text-xs text-white shadow-xl backdrop-blur-md">
                <span className="text-[#06b6d4] font-bold mr-1">// OUTPOST TELEMETRY:</span>
                <span className="text-gray-200">{activeNote}</span>
                {hoveredHit?.targetId && (
                  <a
                    href={`#${hoveredHit.targetId}`}
                    onClick={() => audio.select()}
                    className="inline-flex items-center gap-1 ml-2 text-[10px] font-bold text-[#ff5a1f] underline hover:text-white"
                  >
                    <span>Jump to section</span>
                    <ArrowUpRight size={10} />
                  </a>
                )}
              </div>

              {/* Viewport Hotkeys / Quick Shortcuts */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => handleSelectPreset("server")}
                  className="rounded-sm border border-white/10 bg-[#1e293b]/80 px-2.5 py-1 font-mono text-[10px] text-cyan-400 shadow-xs hover:border-cyan-400 backdrop-blur-xs"
                >
                  Focus Server
                </button>
                <button
                  onClick={() => handleSelectPreset("workstation")}
                  className="rounded-sm border border-white/10 bg-[#1e293b]/80 px-2.5 py-1 font-mono text-[10px] text-emerald-400 shadow-xs hover:border-emerald-400 backdrop-blur-xs"
                >
                  Focus Terminal
                </button>
                <button
                  onClick={() => handleSelectPreset("arcade")}
                  className="rounded-sm border border-white/10 bg-[#1e293b]/80 px-2.5 py-1 font-mono text-[10px] text-orange-400 shadow-xs hover:border-orange-400 backdrop-blur-xs"
                >
                  Focus Arcade
                </button>
              </div>
            </div>
          </div>

          {/* Quick-Spec Bar */}
          <div className="grid grid-cols-2 divide-x divide-[#e5e1d8] border-t border-[#e5e1d8] bg-[#f8f7f4] sm:grid-cols-4">
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Asset Budget</span>
              <span className="font-mono text-xs font-bold text-[#141619]">329 KB (Meshopt Compressed)</span>
            </div>
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Geometry Pipeline</span>
              <span className="font-mono text-xs font-bold text-[#141619]">78 Meshes · 36K Triangles</span>
            </div>
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Frame Rate</span>
              <span className="font-mono text-xs font-bold text-[#10b981]">60 FPS · Hardware Accelerated</span>
            </div>
            <div className="p-3 text-center">
              <span className="block font-mono text-[10px] text-[#646872] uppercase">Shadows &amp; Shading</span>
              <span className="font-mono text-xs font-bold text-[#141619]">Raytraced Vertex AO Baked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
