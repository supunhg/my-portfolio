"use client";

import { Server, ShieldCheck, Key, RefreshCw, Activity, Terminal, ExternalLink, Database, CheckCircle2, FileText, Download, Code2 } from "lucide-react";
import { audio } from "@/lib/audio";

export function PillarLab() {
  const repoUrl = "https://github.com/supunhg/nibm-lab-infrastructure";

  const metrics = [
    { label: "Docker Containers", value: "34", detail: "Defined as Code & Tested" },
    { label: "Identity Layer", value: "Authentik", detail: "Index number single sign-on" },
    { label: "Vector DB Security", value: "Scoped Keys", detail: "Self-service expiring Qdrant tokens" },
    { label: "Audit Findings Fixed", value: "22 / 22", detail: "Zero exposed backend ports" },
  ];

  return (
    <section id="infrastructure" className="border-b border-[#e5e1d8] bg-[#f8f7f4] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#e5e1d8]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#ff5a1f]">
              <Server size={12} />
              <span>FLAGSHIP INFRASTRUCTURE // NIBM COLOMBO</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#141619]">
              From an empty VM to a campus platform.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-[#52565e] leading-relaxed">
              As a Technical Assistant at NIBM, I initiated, architected, audited, and deployed
              a self-hosted student lab on VMware ESXi—unifying 34 services under a single identity perimeter.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => audio.click()}
                className="btn-tactile inline-flex items-center gap-1.5 rounded-sm bg-[#141619] px-3.5 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-[#ff5a1f]"
              >
                <span>github.com/supunhg/nibm-lab-infrastructure</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={i}
              onMouseEnter={() => audio.dialTick()}
              className="rounded-lg border border-[#e5e1d8] bg-white p-5 shadow-xs"
            >
              <span className="block font-mono text-xs font-semibold text-[#646872] uppercase">
                {m.label}
              </span>
              <span className="mt-1 block text-3xl font-black text-[#141619] tracking-tight">
                {m.value}
              </span>
              <span className="mt-1 block font-mono text-[11px] text-[#ff5a1f]">
                {m.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Deep Dive Architecture Showcase */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: The 4 Core Architectural Subsystems */}
          <div className="lg:col-span-7 space-y-4">
            {/* Box 1 */}
            <div className="rounded-lg border border-[#e5e1d8] bg-white p-6 shadow-xs transition-all hover:border-[#141619]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#141619] text-white">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-[#141619] text-base">
                    One Identity Per Person (Authentik IAM)
                  </h3>
                  <span className="font-mono text-xs text-[#646872]">
                    Index-Number Onboarding · Two-Minute Offboarding Bus
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#52565e] leading-relaxed">
                Students register with their campus index number. An admin approves with one click,
                and group membership automatically provisions access across Git, forums, and cloud drives.
                Disabling an account instantly invalidates sessions across all 34 containers in under 120 seconds.
              </p>
            </div>

            {/* Box 2 */}
            <div className="rounded-lg border border-[#e5e1d8] bg-white p-6 shadow-xs transition-all hover:border-[#141619]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#ff5a1f] text-white">
                  <Database size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-[#141619] text-base">
                    Scoped AI Vector Infrastructure (Qdrant)
                  </h3>
                  <span className="font-mono text-xs text-[#646872]">
                    Lua Reverse Proxy Gateway · Expiring Granular Keys
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#52565e] leading-relaxed">
                Students needed vector storage for AI research, but exposing the root master key would compromise the cluster.
                I engineered a custom self-service form and Lua proxy gateway that mints scoped, expiring API keys
                (read-only, per-collection, or project-tiered) so no student ever handles the master key.
              </p>
            </div>

            {/* Box 3 */}
            <div className="rounded-lg border border-[#e5e1d8] bg-white p-6 shadow-xs transition-all hover:border-[#141619]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#2563eb] text-white">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-[#141619] text-base">
                    22 Audit Findings Remediated
                  </h3>
                  <span className="font-mono text-xs text-[#646872]">
                    Docker UFW Bypass Mitigated · Key-Only SSH · Pinned Hashes
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#52565e] leading-relaxed">
                Addressed Docker’s notorious iptables bypass with strict UFW forwarding rules, locked administrative endpoints
                behind mutual TLS and Authentik proxy forward-auth, pinned all container image digests, and established
                nightly encrypted Restic backups to off-site storage.
              </p>
            </div>

            {/* Whitepaper & Slide Deck Download Bar */}
            <div className="rounded-lg border border-[#e5e1d8] bg-[#ebe7df] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#141619]">
                <FileText size={16} className="text-[#ff5a1f]" />
                <span>OFFICIAL CASE STUDY & ARCHITECTURE ARTIFACTS:</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/docs/NIBM-Lab-Case-Study_Supun-Hewagamage.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => audio.click()}
                  className="inline-flex items-center gap-1 rounded bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[#141619] border border-[#d4cfc4] hover:border-[#141619] transition-all"
                >
                  <Download size={12} />
                  <span>Case Study (.PDF)</span>
                </a>
                <a
                  href="/docs/NIBM-Lab-Carousel_Supun-Hewagamage.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => audio.click()}
                  className="inline-flex items-center gap-1 rounded bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[#141619] border border-[#d4cfc4] hover:border-[#141619] transition-all"
                >
                  <Download size={12} />
                  <span>Slides (.PDF)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Schematic Card */}
          <div className="lg:col-span-5 rounded-lg border border-[#e5e1d8] bg-[#141619] p-6 text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#10b981]" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Infrastructure Schema
                  </span>
                </div>
                <span className="font-mono text-[10px] text-white/50">Dell PowerEdge · Ubuntu 24.04</span>
              </div>

              {/* Visual ASCII / Layer Diagram */}
              <div className="mt-5 space-y-3 font-mono text-xs">
                <div className="rounded border border-white/15 bg-white/5 p-3">
                  <div className="text-[#ff5a1f] font-bold text-[11px]">// LAYER 01: EDGE & INGRESS</div>
                  <div className="text-white/80 mt-1">Nginx Proxy Manager + Custom OpenResty Lua</div>
                  <div className="text-white/40 text-[10px]">Dual-Lock Forward Auth · Let's Encrypt Wildcard</div>
                </div>

                <div className="rounded border border-white/15 bg-white/5 p-3">
                  <div className="text-[#2563eb] font-bold text-[11px]">// LAYER 02: IDENTITY BUS</div>
                  <div className="text-white/80 mt-1">Authentik OIDC / LDAP Core</div>
                  <div className="text-white/40 text-[10px]">Student Index Verification · MFA Enforced</div>
                </div>

                <div className="rounded border border-white/15 bg-white/5 p-3">
                  <div className="text-[#10b981] font-bold text-[11px]">// LAYER 03: APPLICATION FLEET (34 Containers)</div>
                  <div className="text-white/80 mt-1">Qdrant Vector DB · Forgejo Git · Flarum Forum</div>
                  <div className="text-white/40 text-[10px]">Paperless-ngx · Vaultwarden · n8n Automation</div>
                </div>

                <div className="rounded border border-white/15 bg-white/5 p-3">
                  <div className="text-white/90 font-bold text-[11px]">// LAYER 04: OBSERVABILITY & RECOVERY</div>
                  <div className="text-white/80 mt-1">25 Uptime Kuma Probes · Beszel · ntfy Alerts</div>
                  <div className="text-white/40 text-[10px]">Nightly Encrypted Restic Snapshots</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-[#ff5a1f] transition-colors flex items-center gap-1.5"
              >
                <Code2 size={13} />
                <span>Inspect Repo on GitHub</span>
              </a>
              <span className="text-[#10b981] flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Audited & Documented</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
