"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Shield, Cpu, Binary, Radio, Terminal, MessageSquare } from "lucide-react";
import { AvatarStage } from "@/lib/stage/avatarStage";
import type { AvatarMood } from "@/lib/stage/avatarModel";
import { audio } from "@/lib/audio";

interface AvatarCompanionProps {
  activeSection: string;
}

export function AvatarCompanion({ activeSection }: AvatarCompanionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<AvatarStage | null>(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<AvatarMood>("neutral");
  const [speech, setSpeech] = useState("SENTINEL-01 ONLINE // ALL SYSTEMS NOMINAL");

  useEffect(() => {
    let alive = true;

    const init = async () => {
      if (!canvasRef.current) return;
      try {
        const stage = await AvatarStage.create(canvasRef.current, {
          onMoodChange: (m) => {
            if (alive) setMood(m);
          },
        });
        if (!alive) {
          stage.dispose();
          return;
        }
        stageRef.current = stage;
        setLoading(false);
      } catch (e) {
        console.error("Failed to load Sentinel Avatar:", e);
      }
    };

    init();

    return () => {
      alive = false;
      stageRef.current?.dispose();
    };
  }, []);

  // Update speech & bot posture based on active section
  useEffect(() => {
    if (!stageRef.current) return;

    if (activeSection === "infrastructure") {
      stageRef.current.setScrollProgress(0.25, "infrastructure");
      setSpeech("CAMPUS ESXi CLUSTER // 34 CONTAINERS LOCKED IN AUTHENTIK PERIMETER");
    } else if (activeSection === "forensics") {
      stageRef.current.setScrollProgress(0.5, "forensics");
      setSpeech("BINARY FORENSICS // FILO (GO) & NEMUE (RUST) ENGAGED");
    } else if (activeSection === "creative") {
      stageRef.current.setScrollProgress(0.75, "creative");
      setSpeech("APPLIED 3D // WREN SYNTH & BLENDER PROCEDURAL PIPELINE");
    } else if (activeSection === "contact") {
      stageRef.current.setScrollProgress(1.0, "contact");
      setSpeech("SECURE TRANSMISSION READY // CLICK ME FOR COLLABORATION CHIRP");
    } else {
      stageRef.current.setScrollProgress(0, "hero");
      setSpeech("GREETINGS. I AM SENTINEL-01 // SECURITY DRIVEN & AUTONOMOUS");
    }
  }, [activeSection]);

  const handleBotClick = () => {
    stageRef.current?.model.triggerChirp();
    setSpeech("CHIRP! JOYFUL BARREL ROLL EXECUTED // ( ^ _ ^ )");
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D Canvas Box */}
      <div
        onClick={handleBotClick}
        className="relative h-64 sm:h-80 w-64 sm:w-80 cursor-pointer rounded-2xl border border-[#232936] bg-[#0e1117]/80 backdrop-blur-md p-2 transition-all hover:border-[#06b6d4] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] group"
      >
        {/* Status Pills */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-[#232936] bg-[#08090c]/90 px-2.5 py-1 text-[10px] font-mono text-[#06b6d4]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] animate-ping" />
          <span>SENTINEL-01</span>
        </div>

        <div className="absolute top-3 right-3 z-10 rounded-full border border-[#232936] bg-[#08090c]/90 px-2.5 py-1 text-[10px] font-mono uppercase text-[#9ca3af]">
          {mood}
        </div>

        {loading ? (
          <div className="flex h-full w-full flex-col items-center justify-center text-xs font-mono text-[#06b6d4]">
            <Sparkles className="animate-spin text-[#06b6d4]" size={20} />
            <span className="mt-2">MATERIALIZING BOT...</span>
          </div>
        ) : (
          <canvas ref={canvasRef} className="h-full w-full" />
        )}

        {/* Hover Cue */}
        <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="font-mono text-[10px] text-[#06b6d4] bg-[#08090c]/90 px-2 py-0.5 rounded border border-[#06b6d4]/40">
            Click to interact & spin
          </span>
        </div>
      </div>

      {/* Speech HUD readout */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#232936] bg-[#0e1117] px-4 py-2 text-xs font-mono text-[#f3f4f6] shadow-md max-w-sm text-center">
        <span className="text-[#06b6d4] font-bold">CORE:&gt;</span>
        <span className="text-[#9ca3af]">{speech}</span>
      </div>
    </div>
  );
}
