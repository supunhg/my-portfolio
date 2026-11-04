import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://supun-portfolio-supunhewagamage.vercel.app"),
  title: "Supun Hewagamage — Systems Architect & Security Specialist",
  description:
    "Systems Architect & Offensive Security Specialist. Campus infrastructure (NIBM 34-container lab on ESXi, Authentik IAM), Go-native forensics (Filo), Rust network recon (Nemue), and tactile 3D physical computing (Supercub, Blender 5.2).",
  keywords: [
    "Supun Hewagamage",
    "Systems Architect",
    "Offensive Security",
    "Cyber Security Sri Lanka",
    "NIBM Lab Infrastructure",
    "Authentik IAM",
    "Filo Go Forensics",
    "Nemue Rust Scanner",
    "Supercub Templates",
    "Three.js Portfolio",
    "Blender 5.2 Procedural",
  ],
  authors: [{ name: "Supun Hewagamage", url: "https://github.com/supunhg" }],
  openGraph: {
    title: "Supun Hewagamage — Systems Architect & Security Specialist",
    description: "Heavy-duty infrastructure. Tactile digital craft.",
    url: "https://supun-portfolio-supunhewagamage.vercel.app",
    siteName: "Supun Hewagamage",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supun Hewagamage — Systems Architect & Security Specialist",
    description: "Heavy-duty infrastructure. Tactile digital craft.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Supun Hewagamage",
  jobTitle: "Systems Architect & Offensive Security Specialist",
  url: "https://supun-portfolio-supunhewagamage.vercel.app",
  sameAs: [
    "https://github.com/supunhg",
    "https://www.linkedin.com/in/supunhewagamage"
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "National Institute of Business Management (NIBM)",
  },
  knowsAbout: [
    "VMware ESXi",
    "Docker & Container Orchestration",
    "Authentik Identity Management",
    "Go Systems Programming",
    "Rust Network Programming",
    "Digital Forensics & Reverse Engineering",
    "WebGL & Three.js 3D Graphics",
    "Blender Python API"
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#ff5a1f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
