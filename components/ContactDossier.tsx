"use client";

import { useState } from "react";
import { Mail, Copy, Check, Sparkles, Send, KeyRound } from "lucide-react";
import confetti from "canvas-confetti";
import { audio } from "@/lib/audio";

export function ContactDossier() {
  const [copied, setCopied] = useState(false);
  const email = "supunhewagamage@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    audio.click();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfetti = () => {
    audio.chime();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#ff5a1f", "#141619", "#2563eb", "#ebe9e1"],
    });
  };

  return (
    <section id="contact" className="border-b border-[#e5e1d8] bg-[#f8f7f4] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e5e1d8] bg-white p-8 sm:p-12 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e1d8] bg-[#f8f7f4] px-3 py-1 font-mono text-[11px] font-bold text-[#ff5a1f]">
              <Send size={12} />
              <span>COMMUNICATIONS // DIRECT TRANSMISSION</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#141619]">
              Let’s build something enduring.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#52565e] leading-relaxed">
              Available for systems architecture consults, security engineering engagements,
              and high-assurance digital product collaborations worldwide.
            </p>
          </div>

          {/* Email Copy Card */}
          <div className="mt-8 rounded-xl border border-[#e5e1d8] bg-[#f8f7f4] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#141619] text-white">
                <Mail size={18} />
              </div>
              <div>
                <span className="block font-mono text-[11px] text-[#646872] uppercase font-bold">
                  DIRECT CONTACT
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#141619]">
                  {email}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-sm bg-[#141619] px-4 py-2 font-mono text-xs font-semibold text-white transition-all hover:bg-[#ff5a1f]"
            >
              {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
              <span>{copied ? "Copied to clipboard" : "Copy Email"}</span>
            </button>
          </div>

          {/* Social Profiles Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href="https://github.com/supunhg"
              target="_blank"
              rel="noreferrer"
              onClick={() => audio.click()}
              className="flex items-center justify-between rounded-xl border border-[#e5e1d8] bg-white p-4 transition-all hover:border-[#141619] hover:shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 fill-[#141619]" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <div>
                  <span className="block text-sm font-bold text-[#141619]">GitHub</span>
                  <span className="block font-mono text-xs text-[#646872]">github.com/supunhg</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#141619] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/supunhewagamage"
              target="_blank"
              rel="noreferrer"
              onClick={() => audio.click()}
              className="flex items-center justify-between rounded-xl border border-[#e5e1d8] bg-white p-4 transition-all hover:border-[#141619] hover:shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 fill-[#0a66c2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37z" />
                </svg>
                <div>
                  <span className="block text-sm font-bold text-[#141619]">LinkedIn</span>
                  <span className="block font-mono text-xs text-[#646872]">in/supunhewagamage</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#141619] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          {/* Security & Fun Trigger */}
          <div className="mt-8 pt-6 border-t border-[#e5e1d8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#646872]">
              <KeyRound size={14} className="text-[#ff5a1f]" />
              <span>PGP ID: 4F92 B7A1 C3D8 9E02</span>
            </div>

            <button
              onClick={handleConfetti}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#e5e1d8] bg-[#f8f7f4] px-3 py-1 font-mono text-xs font-semibold text-[#141619] transition-all hover:border-[#ff5a1f] hover:text-[#ff5a1f]"
            >
              <Sparkles size={13} />
              <span>Trigger Collaboration Chime</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
