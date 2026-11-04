"use client";

import { useState } from "react";
import { Mail, Copy, Check, Sparkles, Send, KeyRound, Radio } from "lucide-react";
import confetti from "canvas-confetti";
import { audio } from "@/lib/audio";

export function ContactDossier() {
  const [copied, setCopied] = useState(false);
  const email = "sanchithahewagamage@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    audio.click();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfetti = () => {
    audio.chime();
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.8 },
      colors: ["#06b6d4", "#10b981", "#ff5a1f", "#f3f4f6"],
    });
  };

  return (
    <section id="contact" className="border-b border-[#232936] bg-[#0b0e14] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#232936] bg-[#0e1117] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 h-48 w-48 bg-[#06b6d4]/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-3 py-1 font-mono text-[11px] font-bold text-[#06b6d4]">
              <Send size={12} />
              <span>SECURE COMMUNICATIONS // DIRECT TRANSMISSION</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#f3f4f6]">
              Let’s build fortified systems.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#9ca3af] leading-relaxed">
              Open for offensive security engagements, infrastructure architecture consults,
              and high-assurance systems engineering worldwide.
            </p>
          </div>

          {/* Email Copy Card */}
          <div className="mt-8 rounded-xl border border-[#232936] bg-[#08090c] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4]">
                <Mail size={18} />
              </div>
              <div>
                <span className="block font-mono text-[11px] text-[#9ca3af] uppercase font-bold">
                  PRIMARY ENCRYPTION ADDRESS
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#f3f4f6]">
                  {email}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="btn-cyber-primary inline-flex items-center gap-1.5 rounded-sm px-4 py-2 font-mono text-xs font-bold transition-all"
            >
              {copied ? <Check size={14} className="text-[#08090c]" /> : <Copy size={14} />}
              <span>{copied ? "COPIED TO CLIPBOARD" : "COPY EMAIL"}</span>
            </button>
          </div>

          {/* Social Profiles Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 relative z-10">
            <a
              href="https://github.com/supunhg"
              target="_blank"
              rel="noreferrer"
              onClick={() => audio.click()}
              className="flex items-center justify-between rounded-xl border border-[#232936] bg-[#08090c] p-4 transition-all hover:border-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] group"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 fill-[#f3f4f6] group-hover:fill-[#06b6d4] transition-colors" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <div>
                  <span className="block text-sm font-bold text-[#f3f4f6]">GitHub Profile</span>
                  <span className="block font-mono text-xs text-[#9ca3af]">github.com/supunhg</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#06b6d4] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/supunhewagamage"
              target="_blank"
              rel="noreferrer"
              onClick={() => audio.click()}
              className="flex items-center justify-between rounded-xl border border-[#232936] bg-[#08090c] p-4 transition-all hover:border-[#0a66c2] hover:shadow-[0_0_15px_rgba(10,102,194,0.3)] group"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 fill-[#0a66c2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37z" />
                </svg>
                <div>
                  <span className="block text-sm font-bold text-[#f3f4f6]">LinkedIn Network</span>
                  <span className="block font-mono text-xs text-[#9ca3af]">in/supunhewagamage</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#06b6d4] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          {/* Security & Fun Trigger */}
          <div className="mt-8 pt-6 border-t border-[#232936] flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 font-mono text-xs text-[#9ca3af]">
              <KeyRound size={14} className="text-[#06b6d4]" />
              <span>PGP FINGERPRINT: 4F92 B7A1 C3D8 9E02</span>
            </div>

            <button
              onClick={handleConfetti}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#232936] bg-[#08090c] px-3 py-1 font-mono text-xs font-semibold text-[#06b6d4] transition-all hover:border-[#06b6d4] hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            >
              <Sparkles size={13} />
              <span>TRIGGER COLLABORATION CHIME</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
