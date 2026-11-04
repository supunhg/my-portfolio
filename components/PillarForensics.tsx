"use client";

import { useState } from "react";
import { Terminal, Binary, Copy, Check, Shield, Search, ArrowUpRight } from "lucide-react";
import { audio } from "@/lib/audio";

export function PillarForensics() {
  const [activeTab, setActiveTab] = useState<"filo" | "nemue" | "gtfobins">("filo");
  const [copied, setCopied] = useState(false);

  const tools = {
    filo: {
      title: "Filo // Forensic Binary Engine",
      lang: "Go 1.23",
      github: "supunhg/filo-go",
      tagline: "Replaces binwalk, file, strings, and ExifTool with a single high-speed Go binary.",
      description:
        "Engineered for malware analysts and digital forensics investigators. Performs deep recursive archive extraction, entropy calculation, and signature matching across 90+ CPU architectures without external Python or C dependencies.",
      command: "filo inspect -v --deep --entropy firmware_dump.bin",
      output: `[+] FILO FORENSIC ENGINE v2.4 (Go-Native)
[*] Analyzing: firmware_dump.bin (14.2 MB)
------------------------------------------------------------
0x00000000   uImage Header (ARM Linux, compressed)
0x00000040   gzip compressed data (deflated, max compression)
0x00240180   SquashFS filesystem (little endian, v4.0, lz4)
0x00892010   OpenSSL X.509 Certificate (Self-Signed CA)
------------------------------------------------------------
[✓] Entropy Peak: 7.982 bits/byte (Encrypted / Compressed region at 0x240000)
[✓] Extracted 42 internal files in 184ms across 8 threads`,
    },
    nemue: {
      title: "Nemue // Network Recon Suite",
      lang: "Rust",
      github: "supunhg/nemue",
      tagline: "Ultra-fast asynchronous SYN/UDP port scanner with embedded Lua scripting.",
      description:
        "High-performance security scanner written from scratch in Rust. Features raw socket packet crafting, custom OS fingerprinting heuristics, Lua scriptable vulnerability checks, and Prometheus metrics export.",
      command: "nemue scan --syn -p 1-65535 --script vulns.lua 192.168.1.0/24",
      output: `[+] NEMUE NETWORK SCANNER (Rust / Tokio Runtime)
[*] Target Subnet: 192.168.1.0/24 (254 hosts)
------------------------------------------------------------
[192.168.1.1]   GATEWAY       22/tcp (OpenSSH 9.6p1), 443/tcp (nginx)
[192.168.1.45]  ESXi HOST     443/tcp (VMware vCenter API), 902/tcp
[192.168.1.102] QDRANT CLUSTER 6333/tcp (REST), 6334/tcp (gRPC)
------------------------------------------------------------
[✓] 16,588,090 SYN packets dispatched · 0 packet loss
[✓] Scan completed in 1.42 seconds (11,680 pkts/sec)`,
    },
    gtfobins: {
      title: "GTFOBins-CLI // PrivEsc Reference",
      lang: "Go / CLI",
      github: "supunhg/GTFOBins-CLI",
      tagline: "Instant terminal lookup of 366 Linux binaries and 1400+ privilege escalation techniques.",
      description:
        "Terminal companion for penetration testers and ethical hackers. Delivers offline, millisecond queries for SUID, sudo, file write, and reverse shell bypasses without touching the browser.",
      command: "gtfobins lookup find --function sudo",
      output: `[+] GTFOBINS-CLI // Privilege Escalation Database
Binary: find | Function: sudo
------------------------------------------------------------
Technique: Execute arbitrary commands with elevated privileges:
$ sudo find . -exec /bin/sh \\; -quit

SUID Variant:
$ ./find . -exec /bin/sh -p \\; -quit
------------------------------------------------------------
[✓] Technique verified across Ubuntu / Debian / RHEL / Alpine`,
    },
  };

  const current = tools[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.command);
    setCopied(true);
    audio.click();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="forensics" className="border-b border-[#e5e1d8] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#e5e1d8]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#e5e1d8] bg-[#f8f7f4] px-2.5 py-1 font-mono text-[11px] font-bold text-[#2563eb]">
              <Binary size={12} />
              <span>HIGH-ASSURANCE SYSTEMS // FORENSICS & RECON</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#141619]">
              Fast binaries. Zero dependencies.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#52565e] leading-relaxed">
            When analyzing binaries or scanning campus subnets, latency and reliability are non-negotiable.
            I develop standalone systems utilities compiled natively in Go and Rust.
          </p>
        </div>

        {/* Interactive Tool Selector Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(["filo", "nemue", "gtfobins"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                audio.click();
              }}
              className={`rounded-sm px-4 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#141619] text-white shadow-xs"
                  : "border border-[#e5e1d8] bg-[#f8f7f4] text-[#646872] hover:border-[#141619] hover:text-[#141619]"
              }`}
            >
              {tab.toUpperCase()} // {tools[tab].lang}
            </button>
          ))}
        </div>

        {/* Main Interactive Terminal Box */}
        <div className="mt-6 rounded-xl border border-[#e5e1d8] bg-[#141619] shadow-lg overflow-hidden">
          {/* Terminal Window Header */}
          <div className="flex h-11 items-center justify-between border-b border-white/10 bg-[#1c1e22] px-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="ml-2 font-mono text-xs font-bold text-white/80">
                {current.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://github.com/${current.github}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => audio.click()}
                className="font-mono text-[10px] text-[#ff5a1f] bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 px-2 py-0.5 rounded hover:bg-[#ff5a1f] hover:text-white transition-all flex items-center gap-1"
              >
                <span>github.com/{current.github}</span>
                <ArrowUpRight size={11} />
              </a>
              <button
                onClick={handleCopy}
                title="Copy command"
                className="flex items-center gap-1 font-mono text-[11px] text-white/70 hover:text-white transition-colors"
              >
                {copied ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-xs sm:text-sm">
            {/* Command Input Prompt */}
            <div className="flex items-center gap-2 text-white/90 pb-3 border-b border-white/10">
              <span className="text-[#10b981] font-bold">supun@system:~$</span>
              <span className="text-white font-medium">{current.command}</span>
            </div>

            {/* Output */}
            <pre className="mt-4 text-[#bad2e8] whitespace-pre-wrap font-mono leading-relaxed text-xs sm:text-[13px]">
              {current.output}
            </pre>
          </div>

          {/* Tool Description Footer */}
          <div className="border-t border-white/10 bg-[#181a1d] p-5">
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              <strong className="text-white font-semibold">{current.tagline} </strong>
              {current.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
