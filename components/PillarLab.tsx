"use client";

import { Server, ShieldCheck, Key, Activity, Database, CheckCircle2, Lock, FileCode, AlertCircle } from "lucide-react";
import { audio } from "@/lib/audio";

export function PillarLab() {
  const metrics = [
    { label: "FLEET CAPACITY", value: "34 CONTAINERS", detail: "Defined as Code & Tested" },
    { label: "IDENTITY PERIMETER", value: "AUTHENTIK IAM", detail: "Index number single sign-on" },
    { label: "AI INFRASTRUCTURE", value: "SCOPED QDRANT", detail: "Granular self-service expiring keys" },
    { label: "AUDIT FINDINGS", value: "22 / 22 RESOLVED", detail: "Docker UFW bypass eliminated" },
  ];

  return (
    <section id="infrastructure" className="border-b border-[#232936] bg-[#0b0e14] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#232936]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#10b981]/30 bg-[#10b981]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#10b981]">
              <Server size={12} />
              <span>HARDENED CASE STUDY // NIBM CAMPUS INFRASTRUCTURE</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#f3f4f6]">
              From an empty VM to a fortified campus platform.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              As a Technical Assistant at NIBM Colombo, I took the initiative to architect, deploy, audit,
              and harden a campus student lab on VMware ESXi—unifying 34 services under an identity-first boundary.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-[#06b6d4]">
              <AlertCircle size={12} />
              <span>OPSEC: Production IPs, internal subnets & hashes sanitized for public review.</span>
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono">
          {metrics.map((m, i) => (
            <div
              key={i}
              onMouseEnter={() => audio.dialTick()}
              className="cyber-panel rounded-xl p-5"
            >
              <span className="block text-[11px] text-[#9ca3af] uppercase">
                {m.label}
              </span>
              <span className="mt-1 block text-2xl sm:text-3xl font-black text-[#10b981] glow-emerald">
                {m.value}
              </span>
              <span className="mt-1 block text-[11px] text-[#06b6d4]">
                {m.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Deep Dive Architecture Showcase */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Architectural Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            {/* Box 1: Identity */}
            <div className="cyber-panel rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#06b6d4]/40 bg-[#06b6d4]/10 text-[#06b6d4]">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[#f3f4f6] text-base">
                    One Identity Per Person (Authentik IAM)
                  </h3>
                  <span className="font-mono text-xs text-[#06b6d4]">
                    Index-Number Single Sign-On · 2-Minute Revocation Bus
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#9ca3af] leading-relaxed">
                Students register with their university index number. An admin approves with one click,
                and group membership automatically provisions access across Forgejo Git, Flarum forum, and internal services.
                Disabling an account cuts off session tokens everywhere within 120 seconds.
              </p>
            </div>

            {/* Box 2: Scoped Vector DB */}
            <div className="cyber-panel rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[#f3f4f6] text-base">
                    Scoped AI Vector Infrastructure (Qdrant)
                  </h3>
                  <span className="font-mono text-xs text-[#10b981]">
                    Lua Reverse Proxy Gateway · Granular Expiring Tokens
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#9ca3af] leading-relaxed">
                Students needed vector search capabilities for AI projects, but exposing the root API key would risk the entire cluster.
                I engineered a self-service request form and OpenResty Lua reverse proxy that mints scoped, expiring tokens
                (read-only or collection-isolated) so students never see the root master key.
              </p>
            </div>

            {/* Box 3: 22 Audit Findings Remediated */}
            <div className="cyber-panel rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#ff5a1f]/40 bg-[#ff5a1f]/10 text-[#ff5a1f]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[#f3f4f6] text-base">
                    22 Audit Findings Remediated
                  </h3>
                  <span className="font-mono text-xs text-[#ff5a1f]">
                    Docker UFW Bypass Mitigated · Key-Only SSH · Restic Encryption
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#9ca3af] leading-relaxed">
                Addressed Docker’s standard iptables forwarding bypass with strict UFW filtering rules, pinned all container
                image digests, restricted admin consoles behind dual-lock forward-auth, and established nightly encrypted
                backups with automated restore-testing.
              </p>
            </div>
          </div>

          {/* Right Column: Architectural Terminal Schematic */}
          <div className="lg:col-span-5 rounded-xl border border-[#232936] bg-[#08090c] p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#232936] pb-4">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#10b981]" />
                  <span className="font-mono text-xs font-bold text-[#f3f4f6] uppercase tracking-wider">
                    Infrastructure Topology
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#9ca3af]">Dell PowerEdge · ESXi 8.0</span>
              </div>

              {/* Visual ASCII / Layer Diagram */}
              <div className="mt-5 space-y-3 font-mono text-xs">
                <div className="rounded border border-[#06b6d4]/30 bg-[#06b6d4]/5 p-3">
                  <div className="text-[#06b6d4] font-bold text-[11px]">// LAYER 01: EDGE & INGRESS</div>
                  <div className="text-white/90 mt-1">Nginx Proxy Manager + OpenResty Lua</div>
                  <div className="text-[#9ca3af] text-[10px]">Dual-Lock Forward Auth · Wildcard Let's Encrypt</div>
                </div>

                <div className="rounded border border-[#10b981]/30 bg-[#10b981]/5 p-3">
                  <div className="text-[#10b981] font-bold text-[11px]">// LAYER 02: IDENTITY PERIMETER</div>
                  <div className="text-white/90 mt-1">Authentik OIDC & LDAP Directory</div>
                  <div className="text-[#9ca3af] text-[10px]">Student Index Verification · MFA Enforcement</div>
                </div>

                <div className="rounded border border-[#3b82f6]/30 bg-[#3b82f6]/5 p-3">
                  <div className="text-[#3b82f6] font-bold text-[11px]">// LAYER 03: 34 CONTAINER FLEET</div>
                  <div className="text-white/90 mt-1">Qdrant Vector DB · Forgejo · Flarum · Vaultwarden</div>
                  <div className="text-[#9ca3af] text-[10px]">Paperless-ngx · n8n Automation Engine</div>
                </div>

                <div className="rounded border border-[#ff5a1f]/30 bg-[#ff5a1f]/5 p-3">
                  <div className="text-[#ff5a1f] font-bold text-[11px]">// LAYER 04: SURVIVABILITY</div>
                  <div className="text-white/90 mt-1">25 Uptime Kuma Probes · Beszel · ntfy Alerts</div>
                  <div className="text-[#9ca3af] text-[10px]">Nightly Encrypted Restic Off-Site Snapshots</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232936] flex items-center justify-between text-xs font-mono text-[#9ca3af]">
              <span>Active in NIBM Colombo</span>
              <span className="text-[#10b981] flex items-center gap-1 font-bold">
                <CheckCircle2 size={12} />
                <span>Audited & Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
