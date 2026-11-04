import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supun Hewagamage — Offensive Security & Systems Architect",
  description:
    "Ethical Hacking & Network Security undergraduate. Architect of NIBM's 34-container campus ESXi lab (Authentik IAM), Go forensics (Filo), Rust network recon (Nemue), and interactive 3D WebGL computing.",
  keywords: [
    "Supun Hewagamage",
    "Ethical Hacking",
    "Offensive Security Sri Lanka",
    "Systems Architect",
    "NIBM Campus Infrastructure",
    "Authentik OIDC",
    "Filo Go Forensics",
    "Nemue Rust Scanner",
    "Three.js Cyber Portfolio",
    "Blender 5.2",
  ],
  authors: [{ name: "Supun Hewagamage", url: "https://github.com/supunhg" }],
  openGraph: {
    title: "Supun Hewagamage — Offensive Security & Systems Architect",
    description: "I attack systems to understand them. I build them to endure.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supun Hewagamage — Offensive Security & Systems Architect",
    description: "I attack systems to understand them. I build them to endure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#08090c] text-[#f3f4f6] selection:bg-[#06b6d4] selection:text-[#08090c]">
        {children}
      </body>
    </html>
  );
}
