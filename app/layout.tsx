import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supun Hewagamage — Systems Architect & Security Specialist",
  description:
    "Systems Architect & Offensive Security Specialist. Campus infrastructure (NIBM 34-container lab, Authentik IAM), Go-native forensics (Filo), Rust network recon (Nemue), and tactile 3D computing (Supercub, Blender 5.2).",
  keywords: [
    "Supun Hewagamage",
    "Systems Architect",
    "Offensive Security",
    "Cyber Security Sri Lanka",
    "NIBM Lab Infrastructure",
    "Authentik",
    "Filo Go Forensics",
    "Nemue Rust Scanner",
    "Supercub",
    "Three.js Portfolio",
    "Blender 5.2",
  ],
  authors: [{ name: "Supun Hewagamage", url: "https://github.com/supunhg" }],
  openGraph: {
    title: "Supun Hewagamage — Systems Architect & Security Specialist",
    description: "Heavy-duty infrastructure. Tactile digital craft.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supun Hewagamage — Systems Architect & Security Specialist",
    description: "Heavy-duty infrastructure. Tactile digital craft.",
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
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#ff5a1f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
