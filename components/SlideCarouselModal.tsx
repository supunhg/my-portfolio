"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Presentation, Maximize2, Minimize2 } from "lucide-react";
import { audio } from "@/lib/audio";

interface SlideCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_SLIDES = 10;

const SLIDE_TITLES = [
  "Campus Lab Infrastructure // Architectural Deck",
  "The Challenge // Legacy Bottlenecks & Audit Needs",
  "Design Principles // Hypervisor, Isolation & Fleet",
  "Core Architecture // 34 Containers on VMware ESXi",
  "Identity Perimeter // Authentik OIDC Single Sign-On",
  "Scoped AI Gateways // Lua Proxy & Qdrant Expiring Keys",
  "Defense in Depth // 22 Audit Findings Remediated",
  "Software-Defined Network // ZeroTier Enterprise Fabric",
  "Recovery & Continuity // Nightly Encrypted Restic Backups",
  "Operational Impact // Production Verification & Handoff",
];

export function SlideCarouselModal({ isOpen, onClose }: SlideCarouselModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    audio.dialTick();
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
    audio.dialTick();
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    audio.click();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        audio.click();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, nextSlide, prevSlide]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#0a0e14]/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Box */}
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#12161f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#161b26] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff5a1f]/10 text-[#ff5a1f] border border-[#ff5a1f]/20">
              <Presentation size={16} />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold text-white tracking-wide uppercase">
                {SLIDE_TITLES[currentSlide]}
              </h3>
              <span className="font-mono text-[10px] text-gray-400">
                NIBM Campus Infrastructure · VMware ESXi 34-Container Fleet
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Slide Index Badge */}
            <div className="px-3 py-1 font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 rounded-full">
              SLIDE {String(currentSlide + 1).padStart(2, "0")} / {TOTAL_SLIDES}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                onClose();
                audio.click();
              }}
              title="Close Presentation (Esc)"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Slide Display Stage */}
        <div className="relative flex-1 flex items-center justify-center bg-[#090c12] p-2 sm:p-6 select-none overflow-hidden">
          {/* Previous Slide Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#1e2533]/80 text-white border border-white/15 hover:bg-[#ff5a1f] hover:border-[#ff5a1f] transition-all shadow-lg backdrop-blur-xs active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Slide Image */}
          <div
            className="relative w-full h-full max-h-[600px] flex items-center justify-center"
            onContextMenu={(e) => e.preventDefault()}
          >
            <Image
              src={`/images/slides/slide-${currentSlide + 1}.jpg`}
              alt={`NIBM Infrastructure Presentation Slide ${currentSlide + 1}`}
              fill
              className="object-contain rounded-lg shadow-2xl pointer-events-none"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>

          {/* Next Slide Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#1e2533]/80 text-white border border-white/15 hover:bg-[#ff5a1f] hover:border-[#ff5a1f] transition-all shadow-lg backdrop-blur-xs active:scale-95"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Bottom Carousel Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 bg-[#161b26] px-4 py-3 sm:px-6 gap-2">
          {/* Key Hint */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-gray-400">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">→</kbd>
            <span>keys to flip ·</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white">Esc</kbd>
            <span>to close</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all rounded-full ${
                  currentSlide === idx
                    ? "w-7 bg-[#ff5a1f]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Security Notice */}
          <div className="font-mono text-[10px] text-gray-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Interactive Viewer · Protected Presentation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
